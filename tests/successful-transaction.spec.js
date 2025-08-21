const { test, expect } = require('@playwright/test');
const { CREDENTIALS, PRODUCTS, URLS } = require('../utils/constants');
const { LoginPage } = require('../pages/login.page');
const { ProductsPage } = require('../pages/products.page');
const { CartPage } = require('../pages/cart.page');
const { CheckoutPage } = require('../pages/checkout.page');
const { calculateTotal } = require('../utils/helpers');
const { createAllureResult } = require('../utils/allure-helper');

test.describe('Successful Transaction Validation', () => {
  let loginPage;
  let productsPage;
  let cartPage;
  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Login with standard user
    await loginPage.goto();
    await loginPage.login(CREDENTIALS.STANDARD_USER, CREDENTIALS.PASSWORD);
  });

  test('Standard user can complete a purchase successfully', async ({ page }) => {
    const testName = 'Standard user can complete a purchase successfully';
    
    try {
      // Get product prices before adding to cart
      const backpackPrice = await productsPage.getProductPrice(PRODUCTS.BACKPACK);
      const tshirtPrice = await productsPage.getProductPrice(PRODUCTS.BOLT_T_SHIRT);
      const expectedTotal = backpackPrice + tshirtPrice;

      // Add products to cart
      await productsPage.addProductToCart(PRODUCTS.BACKPACK);
      await productsPage.addProductToCart(PRODUCTS.BOLT_T_SHIRT);

      // Verify cart badge shows correct count
      const cartCount = await productsPage.getCartItemCount();
      expect(cartCount).toBe(2);

      // Go to cart
      await productsPage.goToCart();

      // Verify products are in cart
      expect(await cartPage.isProductInCart(PRODUCTS.BACKPACK)).toBeTruthy();
      expect(await cartPage.isProductInCart(PRODUCTS.BOLT_T_SHIRT)).toBeTruthy();

      // Proceed to checkout
      await cartPage.goToCheckout();

      // Fill checkout information
      await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');

      // Verify the subtotal is correct
      const subtotal = await checkoutPage.getSubtotal();
      expect(subtotal).toBe(expectedTotal);

      // Complete the purchase
      await checkoutPage.completeCheckout();

      // Verify checkout is complete
      expect(await checkoutPage.isCheckoutComplete()).toBeTruthy();
      await expect(page).toHaveURL(URLS.CHECKOUT_COMPLETE);
      
      // Create Allure result for passed test
      createAllureResult(testName, 'passed');
    } catch (error) {
      // Create Allure result for failed test
      createAllureResult(testName, 'failed', { error });
      throw error;
    }
  });
});