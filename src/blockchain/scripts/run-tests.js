const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting TRBE Blockchain Tests...\n');

// Check if dependencies are installed
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Installing dependencies...');
    try {
        execSync('npm install', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
        console.log('✅ Dependencies installed successfully!\n');
    } catch (error) {
        console.error('❌ Error installing dependencies:', error.message);
        process.exit(1);
    }
}

// Compile contracts
console.log('🔨 Compiling contracts...');
try {
    execSync('npx hardhat compile', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('✅ Contracts compiled successfully!\n');
} catch (error) {
    console.error('❌ Compilation error:', error.message);
    process.exit(1);
}

// Run all tests
console.log('🧪 Running all tests...');
try {
    execSync('npx hardhat test', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('\n✅ All tests passed!');
} catch (error) {
    console.error('\n❌ Some tests failed:', error.message);
    process.exit(1);
}

// Run specific test suites for detailed results
console.log('\n📊 Running individual test suites...\n');

// Run FanClubs tests
console.log('🏆 Running FanClubs tests...');
try {
    execSync('npx hardhat test test/FanClubs.test.js', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('✅ FanClubs tests completed!\n');
} catch (error) {
    console.error('❌ FanClubs tests failed:', error.message);
}

// Run ScoreUser tests
console.log('⭐ Running ScoreUser tests...');
try {
    execSync('npx hardhat test test/ScoreUser.test.js', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('✅ ScoreUser tests completed!\n');
} catch (error) {
    console.error('❌ ScoreUser tests failed:', error.message);
}

console.log('🎉 Test execution completed!');
console.log('\n📋 Summary:');
console.log('- Contracts compiled successfully');
console.log('- All test suites executed');
console.log('- Check individual test results above'); 