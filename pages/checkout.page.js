const { SELECTORS, URLS } = require('../utils/constants');
const { parsePrice } = require('../utils/helpers');

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

  /**
   * Fills in the checkout information
   * @param {string} firstName - Customer's first name
   * @param {string} lastName - Customer's last name
   * @param {string} postalCode - Customer's postal code
   */
  async fillCheckoutInfo(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
    // Wait for navigation to checkout step two
    await this.page.waitForURL('**/checkout-step-two.html');
  }

  /**
   * Completes the checkout process
   */
  async completeCheckout() {
    await this.finishButton.click();
    // Wait for navigation to checkout complete
    await this.page.waitForURL('**/checkout-complete.html');
  }

  /**
   * Gets the subtotal from the checkout summary
   * @returns {Promise<number>} The subtotal amount
   */
  async getSubtotal() {
    const subtotalText = await this.subtotalLabel.textContent();
    // Extract the numeric value from text like "Item total: $29.99"
    const match = subtotalText.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Gets the total from the checkout summary
   * @returns {Promise<number>} The total amount
   */
  async getTotal() {
    const totalText = await this.totalLabel.textContent();
    // Extract the numeric value from text like "Total: $32.39"
    const match = totalText.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Gets all items in the checkout summary
   * @returns {Promise<Array<{name: string, price: number}>>} Array of item objects
   */
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

  /**
   * Checks if the checkout is complete
   * @returns {Promise<boolean>} True if checkout is complete
   */
  async isCheckoutComplete() {
    return await this.completeHeader.isVisible();
  }
}

module.exports = { CheckoutPage };