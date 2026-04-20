// Test LiveAvatar session with ElevenLabs voice ID
const https = require('https');

const API_KEY = '26356173-34f5-11f1-8d28-066a7fa2e369';

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const opts = {
      hostname: 'api.liveavatar.com',
      path: `/v1${path}`,
      method: 'POST',
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      }
    };
    const req = https.request(opts, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        try { resolve(JSON.parse(body)); } catch { resolve(body); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  // Test 1: FULL mode with ElevenLabs voice ID (Ingrid FR)
  console.log('\n=== Test 1: FULL mode + ElevenLabs voice ID ===');
  const r1 = await post('/sessions/token', {
    mode: 'FULL',
    avatar_id: '513fd1b7-7ef9-466d-9af2-344e51eeb833',
    avatar_persona: {
      voice_id: 'FFXYdAYPzn8Tw8KiHZqg', // Ingrid ElevenLabs
      language: 'fr',
      context_id: '98eff136-665c-48ab-a322-0ad3c8c769e0',
      greeting: 'Bonjour, je suis Anna.',
    }
  });
  console.log(JSON.stringify(r1, null, 2));

  // Test 2: LITE mode with ElevenLabs config
  console.log('\n=== Test 2: LITE mode + ElevenLabs agent ===');
  const r2 = await post('/sessions/token', {
    mode: 'LITE',
    avatar_id: '513fd1b7-7ef9-466d-9af2-344e51eeb833',
    eleven_labs_config: {
      secret_id: 'b5a5e2e9-b29f-4c36-9eec-97df2977a0fe',
      agent_id: 'agent_6001kp3x42wse7e96gxgb06w8w9x',
    }
  });
  console.log(JSON.stringify(r2, null, 2));

  // Test 3: FULL mode with native LiveAvatar voice + language fr
  console.log('\n=== Test 3: FULL mode + native voice + fr ===');
  const r3 = await post('/sessions/token', {
    mode: 'FULL',
    avatar_id: '513fd1b7-7ef9-466d-9af2-344e51eeb833',
    avatar_persona: {
      voice_id: 'de5574fc-009e-4a01-a881-9919ef8f5a0c', // Ann native
      language: 'fr',
      context_id: '98eff136-665c-48ab-a322-0ad3c8c769e0',
      greeting: 'Bonjour, je suis Anna.',
    }
  });
  console.log(JSON.stringify(r3, null, 2));
}

main().catch(console.error);
