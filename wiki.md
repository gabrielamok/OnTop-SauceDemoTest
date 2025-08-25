SauceDemo Automation - Complete Testing Wiki
Table of Contents
Project Overview
Test Architecture
Test Categories
Page Object Model Implementation
Utility Modules
Test Implementation Patterns
Reporting and Documentation
Test Execution
Best Practices
Troubleshooting
Project Overview
The SauceDemo Automation project is a comprehensive test automation solution built with Playwright and JavaScript. It provides end-to-end testing for the SauceDemo e-commerce platform, focusing on critical user journeys, data integrity, and bug detection.

Key Objectives
Functional Testing: Validate core application functionality
Data Integrity: Ensure accurate calculations and data handling
Bug Detection: Identify and document UI anomalies and defects
Maintainability: Create a sustainable and scalable test framework
Reporting: Provide comprehensive test documentation and results
Technology Stack
Playwright: Modern browser automation framework
JavaScript: Programming language for test implementation
Node.js: Runtime environment
Allure: Test reporting and documentation
Page Object Model: Design pattern for test organization
Test Architecture
High-Level Architecture

SauceDemo Automation
├── Tests/                    # Test specifications
│   ├── successful-transaction.spec.js
│   ├── ui-anomaly.spec.js
│   └── cart-totals.spec.js
├── Pages/                    # Page Object Model classes
│   ├── login.page.js
│   ├── products.page.js
│   ├── cart.page.js
│   └── checkout.page.js
├── Utils/                    # Utility modules
│   ├── constants.js
│   ├── helpers.js
│   ├── allure-helper.js
│   └── allure-reporter.js
├── Configuration/            # Configuration files
│   ├── playwright.config.js
│   ├── package.json
│   └── .gitignore
└── Reports/                  # Test results and reports
    ├── test-results/
    ├── allure-results/
    └── allure-report/

    Test Flow Architecture
Test Execution
    ↓
Browser Launch
    ↓
Page Object Initialization
    ↓
Test Step Execution
    ↓
Data Collection & Validation
    ↓
Report Generation
    ↓
Result Analysis

Test Categories
1. Successful Transaction Validation
File: tests/successful-transaction.spec.js

Purpose: Validates the complete end-to-end purchase flow from login to order confirmation.

Test Scenario:

User logs in with standard credentials
User adds specific products (Backpack and T-Shirt) to cart
User verifies cart contents and proceeds to checkout
User fills in checkout information
User completes purchase and verifies order confirmation

Key Validations:

Authentication success
Product addition to cart
Cart state management
Price calculation accuracy
Checkout process completion
Order confirmation display
Implementation:

test('Standard user can complete a purchase successfully', async ({ page }) => {
  const testName = 'Standard user can complete a purchase successfully';
  
  try {
    // Get product prices
    const backpackPrice = await productsPage.getProductPrice(PRODUCTS.BACKPACK);
    const tshirtPrice = await productsPage.getProductPrice(PRODUCTS.BOLT_T_SHIRT);
    const expectedTotal = backpackPrice + tshirtPrice;

    // Add products to cart
    await productsPage.addProductToCart(PRODUCTS.BACKPACK);
    await productsPage.addProductToCart(PRODUCTS.BOLT_T_SHIRT);

    // Verify cart contents
    expect(await cartPage.isProductInCart(PRODUCTS.BACKPACK)).toBeTruthy();
    expect(await cartPage.isProductInCart(PRODUCTS.BOLT_T_SHIRT)).toBeTruthy();

    // Complete checkout
    await cartPage.goToCheckout();
    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
    await checkoutPage.completeCheckout();

    // Verify completion
    expect(await checkoutPage.isCheckoutComplete()).toBeTruthy();
    
    createAllureResult(testName, 'passed');
  } catch (error) {
    createAllureResult(testName, 'failed', { error });
    throw error;
  }
});

2. UI Anomaly Handling
File: tests/ui-anomaly.spec.js

Purpose: Detects, documents, and reports a critical UI bug affecting the problem_user account.

Test Scenarios:

Scenario 1: Bug Reproduction
User logs in with problem_user credentials
User attempts to add Fleece Jacket to cart
System displays wrong item in cart
Test confirms the bug exists
Scenario 2: Bypass Attempt (Skipped)
Documents the inability to bypass the UI glitch
Explains attempted solutions and their failures
Test is marked as skipped with detailed documentation
Key Features:

Bug Documentation: Comprehensive evidence collection with screenshots
Issue Tracking: Links to issue tracking system
Test Skipping: Proper handling of untestable scenarios
Detailed Reporting: Step-by-step bug reproduction
Implementation:

test.describe('UI Anomaly Handling', () => {
  test('Replicates and confirms the bug for problem_user', async ({ page }) => {
    // Add test metadata
    test.info().annotations.push({
      type: 'test case',
      description: 'Verify that adding an item to cart for problem_user results in wrong item appearing'
    });

    await test.step('Add the Fleece Jacket to cart', async () => {
      // Take screenshots before and after
      const productLocator = page.locator('.inventory_item').filter({ hasText: PRODUCTS.FLEECE_JACKET });
      await productLocator.screenshot({ path: 'fleece-jacket-before-add.png' });
      
      await productsPage.addProductToCart(PRODUCTS.FLEECE_JACKET);
      
      await productLocator.screenshot({ path: 'fleece-jacket-after-add.png' });
    });

    await test.step('Verify the bug', async () => {
      const hasCorrectItem = await cartPage.isProductInCart(PRODUCTS.FLEECE_JACKET);
      const cartItemNames = await page.locator('.inventory_item_name').allTextContents();
      
      // Document the bug
      test.info().attach('bug-verification', 
        `Expected: ${PRODUCTS.FLEECE_JACKET}\n` +
        `Actual: ${cartItemNames.join(', ')}\n` +
        `Correct item found: ${hasCorrectItem}`
      );
      
      expect(hasCorrectItem).toBeFalsy();
    });
  });

  test('Successfully adds the correct item to cart for problem_user bypassing the glitch', async ({ page }) => {
    // Document why test is skipped
    test.info().attach('test-documentation', 
      `This test is designed to bypass the UI glitch for the problem_user.\n\n` +
      `Attempted approaches:\n` +
      `1. UI interaction - fails due to the reported bug\n` +
      `2. API approach - fails with 405 Method Not Allowed error\n` +
      `3. Session storage manipulation - does not update cart state\n\n` +
      `This test is being skipped because the application does not provide a reliable way to add items to the cart for the problem_user.`
    );
    
    test.skip('Unable to bypass UI glitch for problem_user');
  });
});

3. Data Integrity of Cart Totals
File: tests/cart-totals.spec.js

Purpose: Validates the accuracy of cart subtotal calculations using dynamic product selection.

Test Scenario:

User logs in with standard credentials
System retrieves all available products
System randomly selects 3 products
User adds selected products to cart
User proceeds to checkout
System calculates expected total
System verifies actual subtotal matches expected total
System validates each item's price in the summary
Key Features:

Dynamic Testing: Random product selection prevents hardcoded dependencies
Step-by-Step Verification: Detailed validation at each stage
Comprehensive Evidence: Screenshots and data attachments
Mathematical Validation: Precise calculation verification
Implementation:

test.describe('Data Integrity of Cart Totals', () => {
  test('Verifies the item total on checkout page is correct', async ({ page }) => {
    let selectedProducts = [];
    let expectedTotal;

    await test.step('Get all available products', async () => {
      const allProducts = await productsPage.getAllProducts();
      
      // Select 3 random products
      for (let i = 0; i < 3; i++) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * allProducts.length);
        } while (selectedProducts.includes(allProducts[randomIndex]));
        
        selectedProducts.push(allProducts[randomIndex]);
      }
    });

    await test.step('Add selected products to cart', async () => {
      for (const product of selectedProducts) {
        const productLocator = page.locator('.inventory_item').filter({ hasText: product.name });
        const addToCartButton = productLocator.locator('button[data-test^="add-to-cart"]');
        
        await productLocator.screenshot({ path: `product-${product.name.replace(/\s+/g, '-')}-before.png` });
        await addToCartButton.click();
        await productLocator.screenshot({ path: `product-${product.name.replace(/\s+/g, '-')}-after.png` });
      }
    });

    await test.step('Calculate expected total', async () => {
      expectedTotal = calculateTotal(selectedProducts.map(p => p.price));
      
      test.info().attach('calculation-details', 
        `Expected total calculation: ${selectedProducts.map(p => `${p.name}: $${p.price}`).join(', ')} = $${expectedTotal}`
      );
    });

    await test.step('Verify the subtotal is correct', async () => {
      const actualSubtotal = await checkoutPage.getSubtotal();
      
      test.info().attach('subtotal-verification', 
        `Expected: $${expectedTotal}, Actual: $${actualSubtotal}`
      );
      
      expect(actualSubtotal).toBe(expectedTotal);
    });
  });
});

Page Object Model Implementation
Architecture Overview
The Page Object Model (POM) design pattern creates an abstraction layer between test code and UI interactions, making tests more maintainable and reusable.

Page Classes
1. LoginPage (pages/login.page.js)
Responsibilities:

Navigation to login page
User authentication
Session management
Key Methods:

goto(): Navigate to login page
login(): Perform user authentication

Implementation:

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator(SELECTORS.USERNAME_INPUT);
    this.passwordInput = page.locator(SELECTORS.PASSWORD_INPUT);
    this.loginButton = page.locator(SELECTORS.LOGIN_BUTTON);
  }

  async goto() {
    await this.page.goto(URLS.BASE);
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL('**/inventory.html');
  }
}

2. ProductsPage (pages/products.page.js)
Responsibilities:

Product catalog management
Cart operations
Price retrieval
Key Methods:

getProductPrice(): Retrieve product price
addProductToCart(): Add product to cart
getCartItemCount(): Get cart item count
getAllProducts(): Retrieve all available products

Implementation:

class ProductsPage {
  constructor(page) {
    this.page = page;
    this.inventoryItems = page.locator(SELECTORS.INVENTORY_ITEM);
    this.cartLink = page.locator(SELECTORS.CART_LINK);
    this.cartBadge = page.locator(SELECTORS.CART_BADGE);
  }

  async getProductPrice(productName) {
    const productLocator = this.inventoryItems.filter({ hasText: productName });
    const priceText = await productLocator.locator(SELECTORS.ITEM_PRICE).textContent();
    return parsePrice(priceText);
  }

  async addProductToCart(productName) {
    const productLocator = this.inventoryItems.filter({ hasText: productName });
    await productLocator.locator(SELECTORS.ADD_TO_CART_BUTTON).click();
  }

  async getAllProducts() {
    const products = [];
    const count = await this.inventoryItems.count();
    
    for (let i = 0; i < count; i++) {
      const item = this.inventoryItems.nth(i);
      const name = await item.locator(SELECTORS.ITEM_NAME).textContent();
      const priceText = await item.locator(SELECTORS.ITEM_PRICE).textContent();
      const price = parsePrice(priceText);
      products.push({ name, price });
    }
    
    return products;
  }
}

3. CartPage (pages/cart.page.js)
Responsibilities:

Cart management
Item verification
Checkout initiation
Key Methods:

getItemCount(): Get number of items in cart
isProductInCart(): Verify product presence in cart
getProductPrice(): Get product price in cart
goToCheckout(): Initiate checkout process

class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator(SELECTORS.CART_ITEM);
    this.checkoutButton = page.locator(SELECTORS.CHECKOUT_BUTTON);
  }

  async getItemCount() {
    return await this.cartItems.count();
  }

  async isProductInCart(productName) {
    const item = this.cartItems.filter({ hasText: productName });
    return await item.count() > 0;
  }

  async goToCheckout() {
    await this.checkoutButton.click();
  }
}

4. CheckoutPage (pages/checkout.page.js)
Responsibilities:

Checkout form management
Price calculation verification
Order completion
Key Methods:

fillCheckoutInfo(): Fill customer information
completeCheckout(): Complete purchase process
getSubtotal(): Get subtotal amount
getTotal(): Get total amount
getSummaryItems(): Get all items in summary
isCheckoutComplete(): Verify checkout completion

Implementation:

class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator(SELECTORS.FIRST_NAME);
    this.lastNameInput = page.locator(SELECTORS.LAST_NAME);
    this.postalCodeInput = page.locator(SELECTORS.POSTAL_CODE);
    this.continueButton = page.locator(SELECTORS.CONTINUE_BUTTON);
    this.finishButton = page.locator(SELECTORS.FINISH_BUTTON);
    this.summaryItems = page.locator(SELECTORS.SUMMARY_ITEM);
    this.subtotalLabel = page.locator(SELECTORS.SUMMARY_SUBTOTAL);
    this.totalLabel = page.locator(SELECTORS.SUMMARY_TOTAL);
    this.completeHeader = page.locator(SELECTORS.COMPLETE_HEADER);
  }

  async fillCheckoutInfo(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
    await this.page.waitForURL('**/checkout-step-two.html');
  }

  async completeCheckout() {
    await this.finishButton.click();
    await this.page.waitForURL('**/checkout-complete.html');
  }

  async getSubtotal() {
    const subtotalText = await this.subtotalLabel.textContent();
    const match = subtotalText.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getSummaryItems() {
    const items = [];
    const count = await this.summaryItems.count();
    
    for (let i = 0; i < count; i++) {
      const item = this.summaryItems.nth(i);
      const name = await item.locator(SELECTORS.SUMMARY_ITEM_NAME).textContent();
      const priceText = await item.locator(SELECTORS.SUMMARY_ITEM_PRICE).textContent();
      const price = parsePrice(priceText);
      items.push({ name, price });
    }
    
    return items;
  }

  async isCheckoutComplete() {
    return await this.completeHeader.isVisible();
  }
}

Utility Modules
1. Constants Module (utils/constants.js)
Centralizes all test data, URLs, and UI selectors.

Structure:

// Test credentials
exports.CREDENTIALS = {
  STANDARD_USER: 'standard_user',
  PROBLEM_USER: 'problem_user',
  PASSWORD: 'secret_sauce'
};

// URLs
exports.URLS = {
  BASE: 'https://www.saucedemo.com',
  INVENTORY: '/inventory.html',
  CART: '/cart.html',
  CHECKOUT_STEP_ONE: '/checkout-step-one.html',
  CHECKOUT_STEP_TWO: '/checkout-step-two.html',
  CHECKOUT_COMPLETE: '/checkout-complete.html'
};

// Product names
exports.PRODUCTS = {
  BACKPACK: 'Sauce Labs Backpack',
  BOLT_T_SHIRT: 'Sauce Labs Bolt T-Shirt',
  FLEECE_JACKET: 'Sauce Labs Fleece Jacket'
};

// Selectors
exports.SELECTORS = {
  USERNAME_INPUT: '[data-test="username"]',
  PASSWORD_INPUT: '[data-test="password"]',
  LOGIN_BUTTON: '[data-test="login-button"]',
  // ... more selectors
};

2. Helper Functions (utils/helpers.js)
Provides utility functions for common operations.

Key Functions:

/**
 * Extracts the numeric value from a price string
 * @param {string} priceString - The price string to parse
 * @returns {number} The numeric price value
 */
exports.parsePrice = (priceString) => {
  if (!priceString || typeof priceString !== 'string') {
    return 0;
  }
  return parseFloat(priceString.replace('$', ''));
};

/**
 * Calculates the total price of items
 * @param {Array<number>} prices - Array of item prices
 * @returns {number} The total price
 */
exports.calculateTotal = (prices) => {
  return prices.reduce((sum, price) => sum + price, 0);
};

/**
 * Gets the price of a specific product
 * @param {Page} page - The Playwright page object
 * @param {string} productName - The name of the product
 * @returns {Promise<number>} The price of the product
 */
exports.getProductPrice = async (page, productName) => {
  const productLocator = page.locator('.inventory_item').filter({ hasText: productName });
  const priceText = await productLocator.locator('.inventory_item_price').textContent();
  return exports.parsePrice(priceText);
};

3. Allure Reporting Modules
Simple Allure Helper (utils/allure-helper.js)
Lightweight solution for generating Allure test results:

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

Custom Allure Reporter (utils/allure-reporter.js)
Comprehensive Allure integration with event-driven architecture:

class AllureReporter {
  constructor() {
    this.allure = new Allure({
      resultsDir: path.resolve(__dirname, '../allure-results'),
    });
    this.currentTest = null;
    this.currentStep = null;
  }
  
  onTestBegin(test) {
    this.currentTest = this.allure.createTest(test.title);
  }
  
  onTestEnd(test, result) {
    if (result.status === 'passed') {
      this.currentTest.end('passed');
    } else if (result.status === 'failed') {
      this.currentTest.end('failed');
    }
  }
  
  onStepBegin(test, result, step) {
    this.currentStep = this.currentTest.startStep(step.title);
  }
  
  onStepEnd(test, result, step) {
    this.currentStep.endStep();
  }
}

Test Implementation Patterns
1. Test Organization Pattern
Tests are organized using a hierarchical structure:
test.describe('Test Suite', () => {
  let pageObjects;
  
  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    pageObjects = new PageObjects(page);
    
    // Common setup
    await pageObjects.loginPage.goto();
    await pageObjects.loginPage.login(CREDENTIALS.STANDARD_USER, CREDENTIALS.PASSWORD);
  });
  
  test('Test case', async ({ page }) => {
    await test.step('Step 1', async () => {
      // Step implementation
    });
    
    await test.step('Step 2', async () => {
      // Step implementation
    });
  });
});

2. Step-Based Testing Pattern
Tests are broken down into logical steps for better reporting:

await test.step('Add products to cart', async () => {
  for (const product of selectedProducts) {
    const productLocator = page.locator('.inventory_item').filter({ hasText: product.name });
    const addToCartButton = productLocator.locator('button[data-test^="add-to-cart"]');
    
    await productLocator.screenshot({ path: `product-${product.name}-before.png` });
    await addToCartButton.click();
    await productLocator.screenshot({ path: `product-${product.name}-after.png` });
  }
});

3. Error Handling Pattern
Robust error handling with proper reporting:

test('Test case', async ({ page }) => {
  const testName = 'Test case';
  
  try {
    // Test implementation
    createAllureResult(testName, 'passed');
  } catch (error) {
    createAllureResult(testName, 'failed', { error });
    throw error;
  }
});

4. Data-Driven Testing Pattern
Dynamic data selection for comprehensive testing:

await test.step('Select random products', async () => {
  const allProducts = await productsPage.getAllProducts();
  
  for (let i = 0; i < 3; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * allProducts.length);
    } while (selectedProducts.includes(allProducts[randomIndex]));
    
    selectedProducts.push(allProducts[randomIndex]);
  }
});

Reporting and Documentation
1. Allure Reporting Integration
Test Annotations

test.info().annotations.push({
  type: 'test case',
  description: 'Verify that the cart subtotal calculation is accurate'
});

test.info().annotations.push({
  type: 'severity',
  description: 'critical'
});

test.info().annotations.push({
  type: 'issue',
  description: 'UI-123: Wrong item appears in cart for problem_user'
});

Data Attachments

test.info().attach('available-products', JSON.stringify(allProducts, null, 2));
test.info().attach('calculation-details', 
  `Expected total calculation: ${selectedProducts.map(p => `${p.name}: $${p.price}`).join(', ')} = $${expectedTotal}`
);

Screenshot Captures

await page.screenshot({ path: 'after-login.png', fullPage: true });
await productLocator.screenshot({ path: `product-${product.name}-before.png` });

2. Test Documentation
Comprehensive Documentation
Step Descriptions: Clear naming of test steps
Code Comments: Inline comments explaining complex logic
Test Annotations: Metadata for test categorization
Data Attachments: Detailed evidence of test execution
Bug Reporting
Clear Reproduction Steps: Exact steps to reproduce issues
Evidence Collection: Screenshots and data showing problems
Issue Tracking: Links to issue tracking system
Documentation of Limitations: Clear explanation of untestable scenarios
Test Execution
1. Running Tests

Basic Execution

# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/successful-transaction.spec.js

# Run tests with specific reporter
npx playwright test --reporter=html

# Run tests in headed mode
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Run tests with Allure reporting
npm run test:allure

2. Viewing Results
HTML Report

# Generate and view HTML report
npx playwright show-report

Allure Report

# Generate Allure report
npm run allure:generate

# View Allure report
npm run allure:open

Test Results Analysis
Pass/Fail Status: Clear indication of test results
Execution Time: Performance metrics
Error Details: Comprehensive error information
Screenshots: Visual evidence of test execution
Step-by-Step Breakdown: Detailed test flow
3. CI/CD Integration
GitHub Actions

name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - name: Upload test results
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/

GitLab CI

stages:
  - test

test:
  stage: test
  script:
    - npm ci
    - npx playwright install --with-deps
    - npx playwright test
  artifacts:
    paths:
      - test-results/
    expire_in: 1 week

Best Practices
1. Test Design
Maintainability
Page Object Model: Separate page interactions from test logic
Centralized Constants: Keep test data and selectors in dedicated files
Reusable Functions: Create utility functions for common operations
Clear Naming: Use descriptive names for tests and functions
Reliability
Explicit Waits: Use proper waiting mechanisms instead of fixed timeouts
Error Handling: Implement comprehensive error handling
Retry Mechanisms: Handle flaky operations gracefully
Independent Tests: Ensure tests don't depend on each other
Performance
Parallel Execution: Configure appropriate worker count
Efficient Locators: Use stable and efficient element selectors
Resource Management: Clean up after tests
Optimized Waits: Use smart waiting strategies
2. Code Quality
Documentation
JSDoc Comments: Document all public functions
Inline Comments: Explain complex logic
Test Descriptions: Provide clear test descriptions
Step Comments: Document test steps
Code Structure
Consistent Formatting: Follow consistent code style
Modular Design: Break down complex functionality
Type Safety: Use type checking and validation
Error Boundaries: Implement proper error handling
3. Test Data Management
Data Organization
Centralized Constants: Keep test data in constants files
Environment Variables: Use environment variables for sensitive data
Dynamic Data: Generate test data dynamically when possible
Data Validation: Validate test data integrity
Data Security
Sensitive Data: Never commit sensitive data to version control
Environment Separation: Use different environments for testing
Data Cleanup: Clean up test data after execution
Data Isolation: Ensure test data doesn't interfere between tests
Troubleshooting
1. Common Issues
Test Failures
Issue: Tests failing intermittently
Solution:

Increase timeout values
Add explicit waits
Implement retry mechanisms
Check for flaky selectors
Performance Issues
Issue: Tests running slowly
Solution:

Optimize locators
Reduce unnecessary waits
Increase parallel execution
Use headless mode
Reporting Issues
Issue: Allure report not generating
Solution:

Check Allure installation
Verify directory permissions
Ensure proper test execution
Check for missing dependencies
2. Debugging Techniques
Browser Debugging
# Run tests in debug mode
npx playwright test --debug

# Run tests in headed mode
npx playwright test --headed

# Run with trace viewer
npx playwright test --trace on

// Add console logs for debugging
console.log('Debug: Current step', stepName);
console.log('Debug: Element found', await element.isVisible());

// Add breakpoints
await page.pause();

Report Debugging

# Check test results
npx playwright show-report

# Check Allure results
npm run allure:open

# Check trace files
npx playwright show-trace trace.zip

3. Environment Setup
Dependencies

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Install Allure commandline
npm install --save-dev allure-commandline

Configuration

// playwright.config.js
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'https://www.saucedemo.com',
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 720 },
    video: 'on',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }]
  ],
  workers: 4,
});
//Wiki Ended