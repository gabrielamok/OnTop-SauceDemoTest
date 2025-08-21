const { SELECTORS } = require('../utils/constants');
const { parsePrice } = require('../utils/helpers');

class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator(SELECTORS.CART_ITEM);
    this.checkoutButton = page.locator(SELECTORS.CHECKOUT_BUTTON);
  }

  /**
   * Gets the number of items in the cart
   * @returns {Promise<number>} The number of items in the cart
   */
  async getItemCount() {
    return await this.cartItems.count();
  }

  /**
   * Checks if a specific product is in the cart
   * @param {string} productName - The name of the product
   * @returns {Promise<boolean>} True if the product is in the cart
   */
  async isProductInCart(productName) {
    const item = this.cartItems.filter({ hasText: productName });
    return await item.count() > 0;
  }

  /**
   * Gets the price of a specific product in the cart
   * @param {string} productName - The name of the product
   * @returns {Promise<number>} The price of the product
   */
  async getProductPrice(productName) {
    const item = this.cartItems.filter({ hasText: productName });
    const priceText = await item.locator(SELECTORS.CART_ITEM_PRICE).textContent();
    return parsePrice(priceText);
  }

  /**
   * Proceeds to checkout
   */
  async goToCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };