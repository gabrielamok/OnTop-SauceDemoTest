const fs = require('fs');
const path = require('path');

// Create allure-results directory if it doesn't exist
const allureResultsDir = path.resolve(__dirname, '../allure-results');
if (!fs.existsSync(allureResultsDir)) {
  fs.mkdirSync(allureResultsDir, { recursive: true });
}

// Helper function to create a simple Allure result file
function createAllureResult(testName, status, details = {}) {
  const result = {
    name: testName,
    status: status,
    stage: 'finished',
    steps: [],
    attachments: [],
    parameters: [],
    start: Date.now() - 1000,
    stop: Date.now(),
    uuid: require('uuid').v4(),
    historyId: require('uuid').v4(),
    fullName: testName,
    labels: [
      { name: 'language', value: 'javascript' },
      { name: 'framework', value: 'playwright' },
      { name: 'thread', value: process.pid.toString() }
    ]
  };

  if (status === 'failed' && details.error) {
    result.statusDetails = {
      message: details.error.message,
      trace: details.error.stack
    };
  }

  const fileName = `${result.uuid}-result.json`;
  fs.writeFileSync(path.join(allureResultsDir, fileName), JSON.stringify(result));
}

module.exports = {
  createAllureResult
};