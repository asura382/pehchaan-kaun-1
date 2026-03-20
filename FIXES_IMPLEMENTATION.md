# WebNovel Engine Pipeline Fixes - Implementation Guide

## CRITICAL FIXES REQUIRED

### 1. Add `cleanChapterText()` Function

**Location:** `services/chapterService.js` - After the OutputSanitizer class (around line 681)

```javascript
// ========================================
// STAGE 5B: CHAPTER TEXT CLEANER
// ========================================
function cleanChapterText(text) {
  if (!text) return '';
  
  let cleaned = text;
  
  // Remove prompt artifacts
  cleaned = cleaned
    .replace(/SCENE TYPE:.*/gi, '')
    .replace(/GENRE:.*/gi, '')
    .replace(/TONE:.*/gi, '')
    .replace(/TARGET AUDIENCE:.*/gi, '')
    .replace(/INTENSITY LEVEL:.*/gi, '');
  
  // Fix UTF-8 encoding corruption
  cleaned = cleaned
    .replace(/ΓÇÖ/g, "'")
    .replace(/ΓÇ£/g, '"')
    .replace(/ΓÇ¥/g, '"')
    .replace(/ΓÇ"/g, '"')
    .replace(/ΓÇ/g, '')
    .replace(/â€"/g, '"')
    .replace(/â€/g, "'")
    .replace(/\u2019/g, "'")
    .replace(/\u201C/g, '"')
    .replace(/\u201D/g, '"');
  
  // Remove duplicate chapter headers (prevents chapter restarting)
  const chapterHeaderPattern = /(?:^|\n)(?:###\s*)?(?:Chapter\s+\d+:\s*.+?)(?:\s*\n|$)/gi;
  const matches = [...cleaned.matchAll(chapterHeaderPattern)];
  if (matches.length > 1) {
    let firstHeaderEnd = matches[0].index + matches[0][0].length;
    cleaned = cleaned.substring(0, firstHeaderEnd) + 
              cleaned.substring(firstHeaderEnd).replace(/(?:\n)?(?:###\s*)?(?:Chapter\s+\d+:\s*.+?)(?:\s*\n)?/gi, '\n');
  }
  
  // Remove "(Continued)" markers
  cleaned = cleaned.replace(/\s*\(Continued\)\s*/gi, ' ');
  
  // Remove excessive blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Clean up multiple spaces
  cleaned = cleaned.replace(/  +/g, ' ');
  
  // Trim whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
}
```

### 2. Update Chapter Generation Pipeline

**Location:** `services/chapterService.js` - StoryOrchestrator.generateChapter() method

**After combining acts (around line 1977), add:**

```javascript
// Combine all acts
let fullChapterContent = `${actI}\n\n${actII}\n\n${actIII}`;

// Apply chapter text cleaning to remove artifacts and fix encoding
logger.info('Step 5b: Cleaning chapter text...');
fullChapterContent = cleanChapterText(fullChapterContent);

// Step 6: Apply duplication detection
logger.info('Step 6: Applying duplication detection...');
```

### 3. Fix All Broken Regex Patterns

**Problem:** Multi-line regex patterns are split across lines causing syntax errors.

**Fix these locations in chapterService.js:**

#### Location 1: Line ~657 (OutputSanitizer.cleanGeneratedContent)
```javascript
// BROKEN (spans lines 657-662):
      .replace(/
\s*
\s*
/g, "

")

// FIXED (single line):
      .replace(/
\s*
\s*
/g, "

")
```

#### Location 2: Line ~788 (StructuralValidator.validateSingleActs)
```javascript
// FIXED:
      cleanedContent = cleanedContent.replace(/
\s*
\s*
/g, "

");
```

#### Location 3: Line ~869 (StructuralValidator.removeEnhancementArtifacts)
```javascript
// FIXED:
    cleaned = cleaned.replace(/
\s*
\s*
/g, "

");
```

#### Location 4: Line ~1210 (CoherencePass.fixBrokenTransitions)
```javascript
// FIXED:
    fixed = fixed.replace(/
\s*
\s*
/g, "

");
```

### 4. Verify Arc Storage (Already Correct)

Arc files are already saved with unique novel IDs:
- `data/arcs/mmfp2l0o17x5fmcyqmp.json`
- `data/arcs/mmeze8jt1c8xzlmnypj.json`

No changes needed - each novel gets its own arc file.

## CORRECT PIPELINE FLOW

```
1. Generate escalation blueprint
2. Generate 3-Act outline  
3. Generate Act I → sanitize
4. Generate Act II → sanitize
5. Generate Act III → sanitize
5b. Combine acts → cleanChapterText() ← NEW STEP
6. Apply duplication detection
7. Apply context continuity
8. Apply emotional enhancement (final 25% only)
9. Run retention scoring
10. Validate escalation structure
11. Handle regeneration if needed
12. Save chapter
```

## KEY RULES

### Act Generators Must Return ONLY Their Section:
- `generateAct1()` → Returns Act I only
- `generateAct2()` → Returns Act II only  
- `generateAct3()` → Returns Act III only

### Chapter Assembly (ONCE):
```javascript
chapter = act1 + "\n\n" + act2 + "\n\n" + act3
```

### Emotional Enhancement Rules:
- Must NOT regenerate the chapter
- Should ONLY modify the final 25% portion
- Uses existing `enhanceSceneContent()` method internally

## TESTING CHECKLIST

After implementing fixes, run:

```bash
node generate.js
```

Expected results:
- ✅ No syntax errors
- ✅ Pipeline completes step 8 without "amplify is not a function" error
- ✅ Generated chapter has NO duplicate sections
- ✅ NO "SCENE TYPE:" artifacts in output
- ✅ Proper quotes (', ") instead of ΓÇÖ, ΓÇ£, ΓÇ¥
- ✅ Single chapter header (no restarts)
- ✅ Word count closer to target (2200 default)
- ✅ Arc files saved as `data/arcs/{novelId}.json`

## IMPLEMENTATION STEPS

1. **Fix broken regex patterns** (4 locations)
2. **Add cleanChapterText() function** (after OutputSanitizer class)
3. **Update pipeline** (call cleanChapterText after combining acts)
4. **Test generation** (run `node generate.js`)

## CURRENT STATUS

✅ Emotional amplifier `amplify()` method added  
✅ Arc storage using unique filenames (already working)  
✅ Regex syntax errors identified (need fixing)  
⏳ cleanChapterText() function defined (needs insertion)  
⏳ Pipeline updated to call cleaning function  

## NEXT ACTIONS

Use PowerShell to fix the broken regex patterns and insert the cleanChapterText function, or manually edit the file to ensure all regex patterns are on single lines.
