const { SELECTORS, PRODUCTS } = require('../utils/constants');
const { parsePrice } = require('../utils/helpers');

class ProductsPage {
  constructor(page) {
    this.page = page;
    this.inventoryItems = page.locator(SELECTORS.INVENTORY_ITEM);
    this.cartLink = page.locator(SELECTORS.CART_LINK);
    this.cartBadge = page.locator(SELECTORS.CART_BADGE);
  }

  /**
   * Gets the price of a specific product
   * @param {string} productName - The name of the product
   * @returns {Promise<number>} The price of the product
   */
  async getProductPrice(productName) {
    const productLocator = this.inventoryItems.filter({ hasText: productName });
    const priceText = await productLocator.locator(SELECTORS.ITEM_PRICE).textContent();
    return parsePrice(priceText);
  }

  /**
   * Adds a product to the cart
   * @param {string} productName - The name of the product to add
   */
  async addProductToCart(productName) {
    const productLocator = this.inventoryItems.filter({ hasText: productName });
    await productLocator.locator(SELECTORS.ADD_TO_CART_BUTTON).click();
  }

  /**
   * Gets the number of items in the cart
   * @returns {Promise<number>} The number of items in the cart
   */
  async getCartItemCount() {
    const badgeText = await this.cartBadge.textContent();
    return badgeText ? parseInt(badgeText) : 0;
  }

  /**
   * Navigates to the cart page
   */
  async goToCart() {
    await this.cartLink.click();
  }

/**
 * Gets all product names and prices
 * @returns {Promise<Array<{name: string, price: number}>>} Array of product objects
 */
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

module.exports = { ProductsPage };