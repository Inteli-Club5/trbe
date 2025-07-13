const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting TRBE servers...\n');

// Start OAuth server
console.log('📡 Starting OAuth server on port 5000...');
const oauthServer = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'src/backend/auth'),
  stdio: 'inherit',
  shell: true
});

// Wait a bit for OAuth server to start
setTimeout(() => {
  // Start main server
  console.log('🌐 Starting main server on port 5001...');
  const mainServer = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'src/backend'),
    stdio: 'inherit',
    shell: true
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    oauthServer.kill('SIGINT');
    mainServer.kill('SIGINT');
    process.exit(0);
  });

  mainServer.on('close', (code) => {
    console.log(`Main server exited with code ${code}`);
    oauthServer.kill('SIGINT');
  });
}, 2000);

oauthServer.on('close', (code) => {
  console.log(`OAuth server exited with code ${code}`);
});

console.log('✅ Servers are starting up...');
console.log('   - OAuth Server: http://localhost:5000');
console.log('   - Main Server: http://localhost:5001');
console.log('   - Frontend: http://localhost:3000\n'); 