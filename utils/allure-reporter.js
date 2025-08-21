const Allure = require('allure-js-commons');
const path = require('path');
const fs = require('fs');

class AllureReporter {
  constructor() {
    this.allure = new Allure({
      resultsDir: path.resolve(__dirname, '../allure-results'),
    });
    this.currentTest = null;
    this.currentStep = null;
  }

  onBegin(config, suite) {
    // Create the results directory if it doesn't exist
    if (!fs.existsSync(path.resolve(__dirname, '../allure-results'))) {
      fs.mkdirSync(path.resolve(__dirname, '../allure-results'), { recursive: true });
    }
  }

  onTestBegin(test) {
    this.currentTest = this.allure.createTest(test.title);
  }

  onTestEnd(test, result) {
    if (result.status === 'passed') {
      this.currentTest.end('passed');
    } else if (result.status === 'failed') {
      this.currentTest.end('failed');
    } else if (result.status === 'timedout') {
      this.currentTest.end('broken');
    }
  }

  onStepBegin(test, result, step) {
    this.currentStep = this.currentTest.startStep(step.title);
  }

  onStepEnd(test, result, step) {
    this.currentStep.endStep();
  }

  onError(error) {
    this.currentTest.status = 'failed';
    this.currentTest.details.message = error.message;
    this.currentTest.details.trace = error.stack;
  }
}

module.exports = AllureReporter;