import { readFileSync } from 'fs';

const content = readFileSync('./node_modules/@heygen/liveavatar-web-sdk/dist/index.esm.js', 'utf-8');

// Find all method definitions (async methodName or methodName() patterns)
const methodMatches = [...content.matchAll(/(\w+)\s*\(\s*\)\s*\{|async\s+(\w+)\s*\(/g)]
  .map(m => m[1] || m[2])
  .filter(Boolean)
  .filter(m => m.length > 2 && m.length < 30);

// Get unique methods
const unique = [...new Set(methodMatches)];
console.log('All methods found:', unique.sort().join(', '));

// Check specific key terms
const terms = ['speak', 'listen', 'message', 'transcri', 'USER_TRANSCRI', 'AVATAR_TRANSCRI', 'agent', 'AGENT', 'startList', 'stopList', 'tts', 'voice'];
for (const term of terms) {
  const found = content.includes(term);
  const count = (content.match(new RegExp(term, 'g')) || []).length;
  console.log(`"${term}": ${found ? `FOUND (${count} times)` : 'NOT FOUND'}`);
}
