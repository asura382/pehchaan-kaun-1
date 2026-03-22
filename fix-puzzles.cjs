const fs = require('fs');

const filePath = './data/puzzles.ts';
let content = fs.readFileSync(filePath, 'utf8');

console.log('Fixing puzzles.ts syntax errors...');

// Fix 1: Line 1700 - Missing closing bracket for clues array
content = content.replace(
  /"The Tenzing Norgay National Adventure Award is named after me"\s*\}/,
  '"The Tenzing Norgay National Adventure Award is named after me"\n    ]'
);

// Fix 2: Line 1920 - Double closing brace
content = content.replace(
  /\]\s*\n\s*\}\s*\},/,
  ']\n  },\n  {'
);

// Write back
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Fixed all syntax errors in puzzles.ts');
