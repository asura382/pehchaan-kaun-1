const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'services', 'chapterService.js');
let content = fs.readFileSync(filePath, 'utf8');

// Read file as lines
let lines = content.split('\n');

// Find and fix the broken patterns
for (let i = 0; i < lines.length; i++) {
  // Check for broken pattern starting with "cleanedContent = cleanedContent.replace(/"
  if (lines[i].includes('cleanedContent = cleanedContent.replace(/') && 
      lines[i+1] && lines[i+1].trim() === '\\s*' &&
      lines[i+2] && lines[i+2].trim() === '\\s*') {
    // Replace the 6-line broken pattern with correct single line
    lines[i] = '      cleanedContent = cleanedContent.replace(/\\n\\s*\\n\\s*\\n/g, "\\n\\n"); // Clean up multiple line breaks';
    lines.splice(i+1, 5); // Remove next 5 lines
    i++; // Skip to next line
  }
  
  // Check for broken pattern starting with "cleaned = cleaned.replace(/"
  if (lines[i].includes('cleaned = cleaned.replace(/') && 
      lines[i+1] && lines[i+1].trim() === '\\s*' &&
      lines[i+2] && lines[i+2].trim() === '\\s*') {
    lines[i] = '    cleaned = cleaned.replace(/\\n\\s*\\n\\s*\\n/g, "\\n\\n"); // Clean up multiple line breaks';
    lines.splice(i+1, 5);
    i++;
  }
  
  // Check for broken pattern starting with "fixed = fixed.replace(/"
  if (lines[i].includes('fixed = fixed.replace(/') && 
      lines[i+1] && lines[i+1].trim() === '\\s*' &&
      lines[i+2] && lines[i+2].trim() === '\\s*') {
    lines[i] = '    fixed = fixed.replace(/\\n\\s*\\n\\s*\\n/g, "\\n\\n"); // Clean up multiple line breaks';
    lines.splice(i+1, 5);
    i++;
  }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Fixed regex patterns in chapterService.js');
