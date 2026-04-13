import { readFileSync } from 'fs';

const content = readFileSync('./node_modules/@heygen/liveavatar-web-sdk/dist/index.esm.js', 'utf-8');

// Find ALL speak occurrences with context
let idx = 0;
let count = 0;
while ((idx = content.indexOf('speak', idx)) >= 0 && count < 10) {
  const snippet = content.slice(Math.max(0, idx - 50), idx + 150);
  if (snippet.includes('function') || snippet.includes('=>') || snippet.includes('(text') || snippet.includes('(msg')) {
    console.log(`--- speak[${count}] at char ${idx} ---`);
    console.log(snippet);
    console.log();
    count++;
  }
  idx++;
}

// Find AVATAR_SPEAK_ENDED usage
console.log('\n=== AVATAR_SPEAK_ENDED usage ===');
idx = content.indexOf('AVATAR_SPEAK_ENDED');
while (idx >= 0) {
  console.log(content.slice(Math.max(0, idx - 50), idx + 200));
  console.log('---');
  idx = content.indexOf('AVATAR_SPEAK_ENDED', idx + 1);
}

// Find USER_SPEAK_ENDED usage  
console.log('\n=== USER_SPEAK_ENDED usage ===');
idx = content.indexOf('USER_SPEAK_ENDED');
while (idx >= 0) {
  console.log(content.slice(Math.max(0, idx - 50), idx + 200));
  console.log('---');
  idx = content.indexOf('USER_SPEAK_ENDED', idx + 1);
}
