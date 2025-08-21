const { test, expect } = require('@playwright/test');
const { CREDENTIALS, URLS } = require('../utils/constants');
const { LoginPage } = require('../pages/login.page');
const { ProductsPage } = require('../pages/products.page');
const { CartPage } = require('../pages/cart.page');
const { CheckoutPage } = require('../pages/checkout.page');
const { calculateTotal } = require('../utils/helpers');

// Add Allure annotations
test.describe('Data Integrity of Cart Totals', () => {
  let loginPage;
  let productsPage;
  let cartPage;
  let checkoutPage;
  let selectedProducts = [];
  let expectedTotal;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Login with standard user
    await test.step('Login with standard user', async () => {
      await loginPage.goto();
      await loginPage.login(CREDENTIALS.STANDARD_USER, CREDENTIALS.PASSWORD);
      
      // Add screenshot to report
      await page.screenshot({ path: 'after-login.png', fullPage: true });
    });
  });

  test('Verifies the item total on checkout page is correct', async ({ page }) => {
    // Add test metadata for Allure
    test.info().annotations.push({
      type: 'test case',
      description: 'Verify that the cart subtotal calculation is accurate'
    });
    
    await test.step('Get all available products', async () => {
      // Get all available products
      const allProducts = await productsPage.getAllProducts();
      
      // Add product list to report
      test.info().attach('available-products', JSON.stringify(allProducts, null, 2));
      
      // Select 3 random products to add to cart
      for (let i = 0; i < 3; i++) {
        // Make sure we don't select the same product twice
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * allProducts.length);
        } while (selectedProducts.includes(allProducts[randomIndex]));
        
        const product = allProducts[randomIndex];
        selectedProducts.push(product);
      }
      
      // Add selected products to report
      test.info().attach('selected-products', JSON.stringify(selectedProducts, null, 2));
    });
    
    await test.step('Add selected products to cart', async () => {
      // Add the products to cart
      for (const product of selectedProducts) {
        const productLocator = page.locator('.inventory_item').filter({ hasText: product.name });
        const addToCartButton = productLocator.locator('button[data-test^="add-to-cart"]');
        
        // Take screenshot before adding each product
        await productLocator.screenshot({ path: `product-${product.name.replace(/\s+/g, '-')}-before.png` });
        
        await addToCartButton.click();
        
        // Take screenshot after adding each product
        await productLocator.screenshot({ path: `product-${product.name.replace(/\s+/g, '-')}-after.png` });
      }
      
      // Take screenshot of cart icon
      await page.locator('.shopping_cart_link').screenshot({ path: 'cart-after-adding.png' });
    });
    
    await test.step('Calculate expected total', async () => {
      // Calculate expected total
      expectedTotal = calculateTotal(selectedProducts.map(p => p.price));
      
      // Add calculation details to report
      test.info().attach('calculation-details', 
        `Expected total calculation: ${selectedProducts.map(p => `${p.name}: $${p.price}`).join(', ')} = $${expectedTotal}`
      );
    });
    
    await test.step('Go to cart and checkout', async () => {
      // Go to cart
      await productsPage.goToCart();
      
      // Take screenshot of cart page
      await page.screenshot({ path: 'cart-page.png', fullPage: true });
      
      // Proceed to checkout
      await cartPage.goToCheckout();
    });
    
    await test.step('Fill checkout information', async () => {
      // Fill checkout information
      await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
      
      // Take screenshot of checkout form
      await page.screenshot({ path: 'checkout-form.png' });
    });
    
    await test.step('Verify the subtotal is correct', async () => {
      // Verify the subtotal is correct
      const actualSubtotal = await checkoutPage.getSubtotal();
      
      // Add verification details to report
      test.info().attach('subtotal-verification', 
        `Expected: $${expectedTotal}, Actual: $${actualSubtotal}`
      );
      
      expect(actualSubtotal).toBe(expectedTotal);
      
      // Take screenshot of checkout summary
      await page.screenshot({ path: 'checkout-summary.png' });
    });
    
    await test.step('Verify each item in the summary', async () => {
      // Verify the items in the summary match what we added
      const summaryItems = await checkoutPage.getSummaryItems();
      expect(summaryItems.length).toBe(selectedProducts.length);
      
      // Add item comparison to report
      const comparison = {
        selected: selectedProducts,
        inSummary: summaryItems
      };
      test.info().attach('item-comparison', JSON.stringify(comparison, null, 2));
      
      // Verify each item's price is correct
      for (const selectedItem of selectedProducts) {
        const summaryItem = summaryItems.find(item => item.name === selectedItem.name);
        expect(summaryItem).toBeDefined();
        expect(summaryItem.price).toBe(selectedItem.price);
      }
    });
  });
});