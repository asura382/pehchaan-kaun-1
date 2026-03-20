# Comprehensive fix for chapterService.js
$filePath = "services\chapterService.js"
$lines = Get-Content $filePath

Write-Host "Applying all structural fixes..."

# Fix 1: Broken regex at line 657 (now around 667 after edits)
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i] -match 'cleanedContent = cleanedContent\.replace\(/' -and $lines[$i+1] -match '^\s*\\n') {
    # Found multi-line regex, replace with single line
    $lines[$i] = '      cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, "\n\n"); // Clean up multiple line breaks'
    for ($j = $i+1; $j -le $i+5; $j++) {
      if ($j -lt $lines.Count) { $lines[$j] = '' }
    }
    Write-Host "Fixed broken regex at line $i"
  }
}

# Fix 2: Broken regex at line 733
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i] -match 'cleaned = cleaned\.replace\(/' -and $lines[$i+1] -match '^\s*\\n') {
    $lines[$i] = '    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, "\n\n"); // Clean up multiple line breaks'
    for ($j = $i+1; $j -le $i+5; $j++) {
      if ($j -lt $lines.Count) { $lines[$j] = '' }
    }
    Write-Host "Fixed broken regex at line $i (733 area)"
  }
}

# Fix 3: Broken regex at line 1060
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i] -match 'fixed = fixed\.replace\(/' -and $lines[$i+1] -match '^\s*\\n') {
    $lines[$i] = '    fixed = fixed.replace(/\n\s*\n\s*\n/g, "\n\n"); // Clean up multiple line breaks'
    for ($j = $i+1; $j -le $i+5; $j++) {
      if ($j -lt $lines.Count) { $lines[$j] = '' }
    }
    Write-Host "Fixed broken regex at line $i (1060 area)"
  }
}

# Fix 4: Malformed line with backslash
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i] -match 'const oneHour = 60 \* 60 \* 1000;\\\s*const now') {
    $lines[$i] = '    const oneHour = 60 * 60 * 1000;'
    $lines = $lines[0..$i] + @('    const now = Date.now();') + $lines[($i+1)..($lines.Count-1)]
    Write-Host "Fixed malformed line at $i"
  }
}

# Save intermediate fix
Set-Content $filePath -Value $lines
Write-Host "Saved regex fixes"

# Reload for class fixes
$lines = Get-Content $filePath

# Fix 5: Add amplify method to EmotionalAmplifier
$amplifyMethod = @'
  
  async amplify(content, options = {}) {
    const { genre, tone, targetAudience, intensityLevel } = options;
    
    if (!content || typeof content !== 'string') {
      logger.warn('Invalid content provided to emotional amplifier');
      return content;
    }
    
    const words = content.split(/\s+/);
    const splitIndex = Math.floor(words.length * 0.75);
    
    if (splitIndex <= 0) {
      logger.warn('Content too short for emotional enhancement');
      return content;
    }
    
    const first75Percent = words.slice(0, splitIndex).join(' ');
    const last25Percent = words.slice(splitIndex).join(' ');
    
    try {
      const enhancedLast25Percent = await this.enhanceSceneContent(last25Percent, {
        genre,
        tone,
        targetAudience,
        intensityLevel,
        sceneType: 'Chapter Climax'
      });
      
      return `${first75Percent} ${enhancedLast25Percent}`.trim();
    } catch (error) {
      logger.warn('Failed to enhance:', error.message);
      return content;
    }
  }
'@

# Find where to insert (after sanitizeEnhancedContent method, before closing brace of EmotionalAmplifier)
$insertIndex = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i] -match 'return sanitized\.trim\(\);') {
    # Find the closing brace of the method
    $braceCount = 0
    for ($j = $i; $j -lt $lines.Count; $j++) {
      if ($lines[$j] -match '^\s*\}') {
        $braceCount++
        if ($braceCount -eq 2) {
          $insertIndex = $j
          break
        }
      }
    }
    break
  }
}

if ($insertIndex -ne -1) {
  $newLines = $lines[0..$insertIndex] + @($amplifyMethod) + $lines[($insertIndex+1)..($lines.Count-1)]
  $lines = $newLines
  Write-Host "Added amplify method to EmotionalAmplifier"
}

# Save final version
Set-Content $filePath -Value $lines
Write-Host "All fixes applied successfully!"
Write-Host "Verifying syntax..."
