const sdk = require('./node_modules/@heygen/liveavatar-web-sdk/dist/index.umd.js');
console.log('=== SDK TOP-LEVEL EXPORTS ===');
console.log(Object.keys(sdk).join('\n'));

if (sdk.LiveAvatarSession) {
  const proto = sdk.LiveAvatarSession.prototype;
  console.log('\n=== LiveAvatarSession METHODS ===');
  console.log(Object.getOwnPropertyNames(proto).join('\n'));
}

if (sdk.AgentEventsEnum) {
  console.log('\n=== AgentEventsEnum VALUES ===');
  console.log(JSON.stringify(sdk.AgentEventsEnum, null, 2));
}

if (sdk.SessionEvent) {
  console.log('\n=== SessionEvent VALUES ===');
  console.log(JSON.stringify(sdk.SessionEvent, null, 2));
}
