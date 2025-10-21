#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting AI Studio E2E Tests...\n');

// Function to run a command
function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    console.log(`📦 Running: ${command} ${args.join(' ')} in ${cwd}`);

    const process = spawn(command, args, {
      cwd: path.resolve(cwd),
      stdio: 'inherit',
      shell: true,
    });

    process.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    process.on('error', error => {
      reject(error);
    });
  });
}

async function runE2ETests() {
  try {
    // Install dependencies if needed
    console.log('📋 Checking dependencies...');

    // Run E2E tests
    console.log('🧪 Running E2E tests...');
    await runCommand('npm', ['run', 'test:e2e'], '.');

    console.log('\n✅ E2E tests completed successfully!');
  } catch (error) {
    console.error('\n❌ E2E tests failed:', error.message);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 E2E tests interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 E2E tests terminated');
  process.exit(0);
});

// Run the tests
runE2ETests();
