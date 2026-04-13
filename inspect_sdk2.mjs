import { readFileSync } from 'fs';

const content = readFileSync('./node_modules/@heygen/liveavatar-web-sdk/dist/index.esm.js', 'utf-8');

// Find context around 'startListening'
const idx = content.indexOf('startListening');
if (idx >= 0) {
  console.log('=== startListening context ===');
  console.log(content.slice(Math.max(0, idx - 200), idx + 500));
}

// Find context around 'speak'
const speakIdx = content.indexOf('speak(');
if (speakIdx >= 0) {
  console.log('\n=== speak() context ===');
  console.log(content.slice(Math.max(0, speakIdx - 100), speakIdx + 300));
}

// Find context around 'USER_TRANSCRIPTION'
const utIdx = content.indexOf('USER_TRANSCRIPTION');
if (utIdx >= 0) {
  console.log('\n=== USER_TRANSCRIPTION context ===');
  console.log(content.slice(Math.max(0, utIdx - 100), utIdx + 500));
}

// Find context around 'waitUntilActiveAgentPresent'
const agentIdx = content.indexOf('waitUntilActiveAgentPresent');
if (agentIdx >= 0) {
  console.log('\n=== waitUntilActiveAgentPresent context ===');
  console.log(content.slice(Math.max(0, agentIdx - 100), agentIdx + 400));
}
