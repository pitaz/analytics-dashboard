const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Analytics Dashboard...\n');

// Start Next.js dev server
console.log('Starting Next.js dev server...');
const nextServer = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
});

// Start WebSocket server
console.log('Starting WebSocket server...');
const wsServer = spawn('node', [path.join(__dirname, '../server/websocket-server.js')], {
  stdio: 'inherit',
  shell: true,
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  nextServer.kill();
  wsServer.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down servers...');
  nextServer.kill();
  wsServer.kill();
  process.exit(0);
});

