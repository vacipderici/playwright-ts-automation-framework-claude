import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
}

export class CheckoutPage extends BasePage {
  private readonly firstNameInput = '[data-test="firstName"]';
  private readonly lastNameInput = '[data-test="lastName"]';
  private readonly zipCodeInput = '[data-test="postalCode"]';
  private readonly continueButton = '[data-test="continue"]';
  private readonly finishButton = '[data-test="finish"]';
  private readonly summaryTotal = '.summary_total_label';
  private readonly confirmationHeader = '.complete-header';
  private readonly errorMessage = '[data-test="error"]';

  constructor(page: Page) {
    super(page);
  }

  async assertOnStepOne(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  async assertOnStepTwo(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  async assertOnComplete(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-complete/);
  }

  async fillCustomerInfo(info: CheckoutInfo): Promise<void> {
    await this.page.fill(this.firstNameInput, info.firstName);
    await this.page.fill(this.lastNameInput, info.lastName);
    await this.page.fill(this.zipCodeInput, info.zipCode);
  }

  async continue(): Promise<void> {
    await this.page.click(this.continueButton);
  }

  async finish(): Promise<void> {
    await this.page.click(this.finishButton);
    await this.assertOnComplete();
  }

  async getOrderTotal(): Promise<string> {
    return this.page.locator(this.summaryTotal).innerText();
  }

  async getConfirmationMessage(): Promise<string> {
    return this.page.locator(this.confirmationHeader).innerText();
  }

  async isErrorVisible(): Promise<boolean> {
    return this.page.locator(this.errorMessage).isVisible();
  }
}
