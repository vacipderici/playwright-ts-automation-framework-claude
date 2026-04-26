import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly pageTitle = '.title';
  private readonly checkoutButton = '[data-test="checkout"]';
  private readonly continueShoppingButton = '[data-test="continue-shopping"]';
  private readonly cartItems = '.cart_item';

  constructor(page: Page) {
    super(page);
  }

  async assertOnCartPage(): Promise<void> {
    await expect(this.page).toHaveURL(/cart/);
    await expect(this.page.locator(this.pageTitle)).toHaveText('Your Cart');
  }

  async getCartItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allInnerTexts();
  }

  async getCartItemCount(): Promise<number> {
    return this.page.locator(this.cartItems).count();
  }

  async proceedToCheckout(): Promise<void> {
    await this.page.click(this.checkoutButton);
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  async continueShopping(): Promise<void> {
    await this.page.click(this.continueShoppingButton);
    await expect(this.page).toHaveURL(/inventory/);
  }
}
