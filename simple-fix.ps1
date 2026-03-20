$filePath = "services\chapterService.js"
$lines = Get-Content $filePath

Write-Host "Scanning for broken regex..."

$fixed = $false
for ($i = 0; $i -lt $lines.Count - 5; $i++) {
    # Look for the exact broken pattern
    if ($lines[$i] -match '\.replace\($' -and 
        $lines[$i+1] -match '^\s*\\s\*$' -and
        $lines[$i+2] -match '^\s*\\s\*$') {
        
        Write-Host "Found broken regex at line $($i+1), fixing..."
        
        # Replace the 6-line broken pattern with 1-line fix
        $newLines = @()
        for ($j = 0; $j -lt $lines.Count; $j++) {
            if ($j -eq $i) {
                # Insert fixed line
                $newLines += '      cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, "\n\n"); // Clean up multiple line breaks'
                $j += 5  # Skip the next 5 broken lines
            }
            if ($j -lt $lines.Count) {
                $newLines += $lines[$j]
            }
        }
        $lines = $newLines
        $fixed = $true
        break
    }
}

if ($fixed) {
    Set-Content $filePath -Value $lines
    Write-Host "Fixed!"
    
    Write-Host "Verifying syntax..."
    $syntaxCheck = node -c $filePath 2>&1
    
    if ($syntaxCheck -eq $null -or $syntaxCheck -eq '') {
        Write-Host "SUCCESS: Syntax is valid!"
    } else {
        Write-Host "ERROR: Syntax errors remain:"
        Write-Host $syntaxCheck
    }
} else {
    Write-Host "No broken regex found"
}
