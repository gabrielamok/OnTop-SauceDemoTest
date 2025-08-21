// Test credentials
exports.CREDENTIALS = {
  STANDARD_USER: 'standard_user',
  PROBLEM_USER: 'problem_user',
  LOCKED_OUT_USER: 'locked_out_user',
  PERFORMANCE_GLITCH_USER: 'performance_glitch_user',
  ERROR_USER: 'error_user',
  VISUAL_USER: 'visual_user',
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
  // Login page
  USERNAME_INPUT: '[data-test="username"]',
  PASSWORD_INPUT: '[data-test="password"]',
  LOGIN_BUTTON: '[data-test="login-button"]',
  
  // Products page
  INVENTORY_ITEM: '.inventory_item',
  ITEM_NAME: '.inventory_item_name',
  ITEM_PRICE: '.inventory_item_price',
  ADD_TO_CART_BUTTON: 'button[data-test^="add-to-cart"]',
  CART_LINK: '[data-test="shopping-cart-link"]',
  CART_BADGE: '[data-test="shopping-cart-badge"]',
  
  // Cart page
  CART_ITEM: '.cart_item',
  CART_ITEM_NAME: '.inventory_item_name',
  CART_ITEM_PRICE: '.inventory_item_price',
  CHECKOUT_BUTTON: '[data-test="checkout"]',
  
  // Checkout pages
  FIRST_NAME: '[data-test="firstName"]',
  LAST_NAME: '[data-test="lastName"]',
  POSTAL_CODE: '[data-test="postalCode"]',
  CONTINUE_BUTTON: '[data-test="continue"]',
  FINISH_BUTTON: '[data-test="finish"]',
  
  // Checkout summary
  SUMMARY_ITEM: '.cart_item',
  SUMMARY_ITEM_NAME: '.inventory_item_name',
  SUMMARY_ITEM_PRICE: '.inventory_item_price',
  SUMMARY_SUBTOTAL: '[data-test="subtotal-label"]',
  SUMMARY_TOTAL: '[data-test="total-label"]',
  
  // Confirmation page
  COMPLETE_HEADER: '[data-test="complete-header"]'
};