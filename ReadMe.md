SauceDemo Automation

This project contains automated tests for the SauceDemo e-commerce platform using Playwright and JavaScript.

Project Structure4

saucedemo-automation/
├── github/workflows/
│   └── playwright-tests.yml
├── allure-report/
├── allure-results/
├── node_modules/
├── pages/
│   ├── cart_page.js
│   ├── checkout_page.js
│   ├── login_page.js
│   └── products_page.js
├── playwright-report/
├── test-results/
├── tests/
│   ├── cart-totals.spec.js
│   ├── successful-transaction.spec.js
│   └── ui-anomaly.spec.js
├── utils/
│   ├── allure-helper.js
│   ├── allure-reporter.js
│   ├── constants.js
│   └── helpers.js
├── package.json
└── README.md

Prerequisites
Node.js (v14 or higher)

npm or yarn

Installation
1. Clone the repository

git clone https://github.com/gabrielamok/OnTop-SauceDemoTest
cd saucedemo-automation



2. Install dependencies

npm init -y

3. Install Playwright browsers


npx playwright install

Running Tests
Run all tests

Run tests with HTML reporter

npx playwright test --reporter=html

Run tests in headed mode

npx playwright test --headed

Run tests in debug mode

npx playwright test --debug

Run a specific test file

npx playwright test tests/testname

Generate Allure report

npx allure generate allure-results --clean -o allure-report
npx allure open allure-report

Test Scenarios
1. Successful Transaction Validation
Verifies that a standard user can log in, add specific products to cart, complete checkout, and reach the confirmation screen

Validates that the final price on the checkout summary is accurate

2. UI Anomaly Handling
Replicates and confirms the reported bug for the problem_user when adding the "Sauce Labs Fleece Jacket" to cart

Documents the inability to bypass the UI glitch for the problem_user

3. Data Integrity of Cart Totals
Dynamically verifies that the "Item total" on the checkout page is correct by calculating the expected total from item prices

Works with random products to ensure it's not dependent on hardcoded values

Approach and Justification
Code Structure
The project follows the Page Object Model (POM) pattern for better maintainability and readability:

Maintainability: Changes to the UI only require updates to the corresponding page objects, not the tests themselves

Reusability: Common interactions can be reused across multiple tests

Readability: Tests focus on business logic rather than implementation details

The project is organized into:

Tests: Contain the actual test cases and assertions

Pages: Represent different application pages and their interactions

Utils: Contain helper functions and constants used across the project

Tests implement a step-based approach using test.step() to create clear, hierarchical test steps that enhance readability and provide better reporting in Allure.

Element Selection Strategy
For element selection, I prioritized:

Stable selectors: Using data-test attributes when available

Semantic selectors: Using attributes that describe the element's purpose

Resilient locators: Creating locators that can withstand minor UI changes

Handling the problem_user Challenge
The problem_user presents a unique challenge where adding an item to the cart results in a different item appearing visually:

Bug Reproduction Test: Adds the item and verifies that the wrong item appears in the cart

Documentation of Limitations: Documents the inability to bypass the UI glitch through various approaches

Test Skipping: Tests that cannot be reliably executed are marked as skipped with detailed explanations

Allure Reporting
The project includes comprehensive Allure reporting with:

Screenshots on test failure

Annotations for better test documentation

Step-by-step execution details

Environment information

Potential Improvements
If I had more time, I would implement:

API Testing: Extend the test suite to include API tests that verify backend functionality independently of the UI

Visual Regression Testing: Implement visual regression tests to catch unexpected UI changes

Enhanced Reporting: Add custom metrics, performance data, and more detailed environment information

Cross-browser Testing: Expand test configuration to run across multiple browsers and devices

Performance Testing: Add performance benchmarks and load testing scenarios

Accessibility Testing: Incorporate accessibility checks to ensure compliance with WCAG guidelines

Mobile Testing: Add mobile device testing capabilities and responsive design validation

CI/CD Integration
The project includes GitHub Actions workflow (playwright-tests.yml) for continuous integration:

Automated test execution on push and pull requests

Allure report generation and artifact storage

Test result reporting in the GitHub Actions interface

Contributing

Follow the Page Object Model pattern for new tests

Use descriptive test names and step descriptions

Include appropriate assertions and error handling

Update documentation when adding new features or tests

Ensure all tests pass before submitting pull requests




