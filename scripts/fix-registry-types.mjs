import { readFileSync, writeFileSync } from 'fs';

const catMap = {
  bird: 'bird',
  mammal: 'mammal',
  insect: 'insect',
  reptile: 'reptile',
  amphibian: 'amphibian',
  marine: 'fish',
};

let content = readFileSync('./src/data/speciesRegistry.ts', 'utf8');

// Handle both LF and CRLF line endings
content = content.replace(
  /category: '(bird|mammal|insect|reptile|amphibian|marine)',\r?\n(\s+)types: \[[^\]]+\]/g,
  (match, cat, indent) => {
    const type = catMap[cat];
    const nl = match.includes('\r\n') ? '\r\n' : '\n';
    return `category: '${cat}',${nl}${indent}types: ['${type}']`;
  }
);

writeFileSync('./src/data/speciesRegistry.ts', content);
console.log('Done — types updated.');
