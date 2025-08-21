const { URLS, SELECTORS } = require('../utils/constants');

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
    // Wait for navigation to complete
    await this.page.waitForURL('**/inventory.html');
  }
}

module.exports = { LoginPage };