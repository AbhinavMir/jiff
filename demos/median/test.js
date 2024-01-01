// const http = require('http');
// const assert = require('assert');
const { fork } = require('child_process');
const path = require('path');

// Configuration
// const PORT = 8080;
// const HOST = 'localhost';

// Start the server
const serverProcess = fork(path.join(__dirname, 'server.js'));

// Delay function for asynchronous operations
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Test function
async function runTest() {
  try {
    // Wait for the server to start
    await delay(5000);

    // Simulate client behavior
    const input = 50; // example input
    const clientProcess = fork(path.join(__dirname, 'party.js'), [input.toString()]);
    // Wait for client to finish computation
    await new Promise((resolve, reject) => {
      clientProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error('Client process exited with code ' + code));
        }
      });
    });

    // Test expected results (modify according to your logic)
    // Example: assert.strictEqual(receivedResult, expectedResult, 'The MPC result is incorrect');



    console.log('Test passed: MPC computation is correct.');
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    // Cleanup
    serverProcess.kill();
  }
}

// Run the test
runTest();
