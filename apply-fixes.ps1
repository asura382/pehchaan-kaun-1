# PowerShell Script to Fix Chapter Service Issues
# This script fixes broken regex patterns and adds cleanChapterText function

Write-Host "=== WebNovel Engine Chapter Service Auto-Fix ===" -ForegroundColor Cyan
Write-Host ""

$filePath = "services\chapterService.js"

# Check if file exists
if (!(Test-Path $filePath)) {
    Write-Host "ERROR: File not found: $filePath" -ForegroundColor Red
    exit 1
}

Write-Host "Loading $filePath..." -ForegroundColor Yellow
$lines = Get-Content $filePath

Write-Host "Fixing broken regex patterns..." -ForegroundColor Yellow

# Fix 1: Line ~657 (OutputSanitizer)
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '^\s*\.replace\(/\\n\s*\n\s*\n/g.*$') {
        # Already fixed
    } elseif ($lines[$i] -match '\.replace\($') {
        # Check if next lines form a broken regex
        if ($i + 5 -lt $lines.Count) {
            $potentialBreak = $lines[$i..($i+5)] -join "`n"
            if ($potentialBreak -match '\.replace\(\s*\n\s*\n\s*\n/g') {
                Write-Host "  Found broken regex at line $($i+1), fixing..." -ForegroundColor Gray
                # Replace the multi-line pattern with single line
                $lines[$i] = $lines[$i] -replace '\.replace\($', '.replace(/\n\s*\n\s*\n/g, "\n\n")'
                for ($j = $i+1; $j -le $i+5; $j++) {
                    if ($j -lt $lines.Count) {
                        $lines[$j] = ''
                    }
                }
            }
        }
    }
}

# Fix 2: Find and fix other instances
$patternsToFix = @(
    @{ Pattern = 'cleanedContent = cleanedContent\.replace\($'; Replacement = 'cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, "\n\n"); // Clean up multiple line breaks' },
    @{ Pattern = 'cleaned = cleaned\.replace\($'; Replacement = 'cleaned = cleaned.replace(/\n\s*\n\s*\n/g, "\n\n");' },
    @{ Pattern = 'fixed = fixed\.replace\($'; Replacement = 'fixed = fixed.replace(/\n\s*\n\s*\n/g, "\n\n");' }
)

foreach ($fix in $patternsToFix) {
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match $fix.Pattern) {
            # Check if it's a broken multi-line regex
            if ($i + 1 -lt $lines.Count -and $lines[$i+1] -match '^\s*\\s\*\s*$') {
                Write-Host "  Fixing pattern at line $($i+1)..." -ForegroundColor Gray
                $lines[$i] = $fix.Replacement
                # Clear the next few lines that were part of the broken regex
                for ($j = 1; $j -le 5; $j++) {
                    if ($i + $j -lt $lines.Count) {
                        $lines[$i + $j] = ''
                    }
                }
            }
        }
    }
}

Write-Host "Removing empty lines from fixes..." -ForegroundColor Gray
$lines = $lines | Where-Object { $_ -ne '' }

Write-Host ""
Write-Host "Checking for cleanChapterText function..." -ForegroundColor Yellow

# Check if cleanChapterText already exists
$hasCleanFunction = $lines -match 'function cleanChapterText'

if ($hasCleanFunction) {
    Write-Host "  cleanChapterText function already exists" -ForegroundColor Green
} else {
    Write-Host "  Adding cleanChapterText function..." -ForegroundColor Yellow
    
    # Find where to insert (after OutputSanitizer class closing brace)
    $insertIndex = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '^\}$' -and $i -gt 0 -and $lines[$i-1] -match 'sanitize\(text\)') {
            $insertIndex = $i + 1
            break
        }
    }
    
    if ($insertIndex -gt 0) {
        $cleanFunction = @(
            '',
            '// ========================================',
            '// STAGE 5B: CHAPTER TEXT CLEANER',
            '// ========================================',
            'function cleanChapterText(text) {',
            '  if (!text) return '''';',
            '  ',
            '  let cleaned = text;',
            '  ',
            '  // Remove prompt artifacts',
            '  cleaned = cleaned',
            '    .replace(/SCENE TYPE:.*/gi, '''')',
            '    .replace(/GENRE:.*/gi, '''')',
            '    .replace(/TONE:.*/gi, '''')',
            '    .replace(/TARGET AUDIENCE:.*/gi, '''')',
            '    .replace(/INTENSITY LEVEL:.*/gi, '''');',
            '  ',
            '  // Fix UTF-8 encoding corruption',
            '  cleaned = cleaned',
            '    .replace(/ΓÇÖ/g, "'")',
            '    .replace(/ΓÇ£/g, '"')',
            '    .replace(/ΓÇ¥/g, '"')',
            '    .replace(/ΓÇ"/g, '"')',
            '    .replace(/ΓÇ/g, '''')',
            '    .replace(/â€"/g, '"')',
            '    .replace(/â€/g, "'")',
            '    .replace(/\u2019/g, "'")',
            '    .replace(/\u201C/g, '"')',
            '    .replace(/\u201D/g, '"');',
            '  ',
            '  // Remove duplicate chapter headers',
            '  const chapterHeaderPattern = /(?:^|\n)(?:###\s*)?(?:Chapter\s+\d+:\s*.+?)(?:\s*\n|$)/gi;',
            '  const matches = [...cleaned.matchAll(chapterHeaderPattern)];',
            '  if (matches.length > 1) {',
            '    let firstHeaderEnd = matches[0].index + matches[0][0].length;',
            '    cleaned = cleaned.substring(0, firstHeaderEnd) + ',
            '              cleaned.substring(firstHeaderEnd).replace(/(?:\n)?(?:###\s*)?(?:Chapter\s+\d+:\s*.+?)(?:\s*\n)?/gi, ''\n'');',
            '  }',
            '  ',
            '  // Remove "(Continued)" markers',
            '  cleaned = cleaned.replace(/\s*\(Continued\)\s*/gi, '' '');',
            '  ',
            '  // Remove excessive blank lines',
            '  cleaned = cleaned.replace(/\n{3,}/g, ''\n\n'');',
            '  ',
            '  // Clean up multiple spaces',
            '  cleaned = cleaned.replace(/  +/g, '' '');',
            '  ',
            '  // Trim whitespace',
            '  cleaned = cleaned.trim();',
            '  ',
            '  return cleaned;',
            '}'
        )
        
        # Insert the function
        $newLines = $lines[0..($insertIndex-1)] + $cleanFunction + $lines[$insertIndex..($lines.Count-1)]
        $lines = $newLines
    } else {
        Write-Host "  WARNING: Could not find insertion point for cleanChapterText" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Saving fixed file..." -ForegroundColor Yellow
Set-Content $filePath -Value $lines

Write-Host ""
Write-Host "Verifying syntax..." -ForegroundColor Yellow
$syntaxCheck = node -c $filePath 2>&1

if ($syntaxCheck -eq $null -or $syntaxCheck -eq '') {
    Write-Host "✓ Syntax check passed!" -ForegroundColor Green
} else {
    Write-Host "✗ Syntax errors found:" -ForegroundColor Red
    Write-Host $syntaxCheck
}

Write-Host ""
Write-Host "=== Fix Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run 'node generate.js' to test chapter generation"
Write-Host "2. Check output for clean prose without artifacts"
Write-Host "3. Verify word count is closer to target (2200 words)"
