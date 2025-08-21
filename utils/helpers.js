/**
 * Extracts the numeric value from a price string (e.g., "$29.99" -> 29.99)
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
 * Gets the price of a specific product from the products page
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {string} productName - The name of the product
 * @returns {Promise<number>} The price of the product
 */
exports.getProductPrice = async (page, productName) => {
  const productLocator = page.locator('.inventory_item').filter({ hasText: productName });
  const priceText = await productLocator.locator('.inventory_item_price').textContent();
  return exports.parsePrice(priceText);
};

/**
 * Finds a product container by its price
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {number} price - The price to search for
 * @returns {Promise<import('@playwright/test').Locator>} The product container locator
 */
exports.findProductByPrice = async (page, price) => {
  const priceString = `$${price.toFixed(2)}`;
  return page.locator('.inventory_item').filter({ hasText: priceString });
};