import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly pageTitle = '.title';
  private readonly cartIcon = '.shopping_cart_link';
  private readonly cartBadge = '.shopping_cart_badge';
  private readonly burgerMenu = '#react-burger-menu-btn';
  private readonly logoutLink = '#logout_sidebar_link';

  constructor(page: Page) {
    super(page);
  }

  async assertOnInventoryPage(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory/);
    await expect(this.page.locator(this.pageTitle)).toHaveText('Products');
  }

  private addToCartButtonFor(productName: string): string {
    return `[data-test="add-to-cart-${productName.toLowerCase().replace(/ /g, '-')}"]`;
  }

  private removeButtonFor(productName: string): string {
    return `[data-test="remove-${productName.toLowerCase().replace(/ /g, '-')}"]`;
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.page.click(this.addToCartButtonFor(productName));
  }

  async removeProductFromCart(productName: string): Promise<void> {
    await this.page.click(this.removeButtonFor(productName));
  }

  async getCartCount(): Promise<number> {
    const badge = this.page.locator(this.cartBadge);
    const visible = await badge.isVisible();
    if (!visible) return 0;
    return parseInt(await badge.innerText(), 10);
  }

  async goToCart(): Promise<void> {
    await this.page.click(this.cartIcon);
    await expect(this.page).toHaveURL(/cart/);
  }

  async logout(): Promise<void> {
    await this.page.click(this.burgerMenu);
    await this.page.click(this.logoutLink);
    await expect(this.page).toHaveURL('/');
  }
}
