# Fix the EmotionalAmplifier class - restore amplifySceneBlocks and add amplify method
$filePath = "services\chapterService.js"
$lines = Get-Content $filePath

# Find line 430 where amplifySceneBlocks starts
# We need to properly close it and then add amplify method

$newLines = @()
$i = 0

while ($i -lt $lines.Count) {
    if ($i -eq 429) {  # Line 430 (0-indexed)
        # Write amplifySceneBlocks properly
        $newLines += '  async amplifySceneBlocks(sceneBlocks, options = {}) {'
        $i++
        
        # Skip until we find where amplify method starts (line 432 currently)
        while ($i -lt $lines.Count -and $lines[$i] -notmatch 'async amplify\(content') {
            $i++
        }
        
        # Now skip the broken amplify method we added
        while ($i -lt $lines.Count -and $lines[$i] -notmatch '^\s*const.*genre.*tone.*targetAudience') {
            $i++
        }
        
        # Add the closing brace for amplifySceneBlocks  
        $newLines += '  }'
        $newLines += ''
        
        # Now add the proper amplify method
        $newLines += '  async amplify(content, options = {}) {'
        $newLines += '    const { genre, tone, targetAudience, intensityLevel } = options;'
        $newLines += '    '
        $newLines += '    if (!content || typeof content !== ''string'') {'
        $newLines += '      logger.warn(''Invalid content provided to emotional amplifier'');'
        $newLines += '      return content;'
        $newLines += '    }'
        $newLines += '    '
        $newLines += '    // Calculate the 75% split point'
        $newLines += '    const words = content.split(/\s+/);'
        $newLines += '    const splitIndex = Math.floor(words.length * 0.75);'
        $newLines += '    '
        $newLines += '    if (splitIndex <= 0) {'
        $newLines += '      logger.warn(''Content too short for emotional enhancement'');'
        $newLines += '      return content;'
        $newLines += '    }'
        $newLines += '    '
        $newLines += '    const first75Percent = words.slice(0, splitIndex).join('' '');'
        $newLines += '    const last25Percent = words.slice(splitIndex).join('' '');'
        $newLines += '    '
        $newLines += '    try {'
        $newLines += '      // Enhance only the final 25%'
        $newLines += '      const enhancedLast25Percent = await this.enhanceSceneContent(last25Percent, {'
        $newLines += '        genre,'
        $newLines += '        tone,'
        $newLines += '        targetAudience,'
        $newLines += '        intensityLevel,'
        $newLines += '        sceneType: ''Chapter Climax'''
        $newLines += '      });'
        $newLines += '      '
        $newLines += '      // Combine back together'
        $newLines += '      const enhancedContent = `${first75Percent} ${enhancedLast25Percent}`.trim();'
        $newLines += '      '
        $newLines += '      logger.info(''Emotional enhancement applied to final 25% of chapter'');'
        $newLines += '      return enhancedContent;'
        $newLines += '    } catch (error) {'
        $newLines += '      logger.warn(''Failed to apply emotional enhancement, using original content:'', error.message);'
        $newLines += '      return content;'
        $newLines += '    }'
        $newLines += '  }'
    } else {
        $newLines += $lines[$i]
        $i++
    }
}

Set-Content $filePath -Value $newLines
Write-Host "Fixed EmotionalAmplifier class"
