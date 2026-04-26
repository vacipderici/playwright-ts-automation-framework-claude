import { test, expect } from '../../fixtures/testFixtures';
import { users } from '../../test-data/users';
import { products, checkoutInfo } from '../../test-data/products';

/**
 * Intentionally failing tests — used to demo Playwright's failure artifacts
 * (screenshots, videos, traces). Tagged @demo-fail to keep separate from CI suite.
 */
test.describe('@demo-fail Intentional Failures', () => {

  test('wrong login error message assertion @demo-fail', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.locked());

    // Actual message contains "locked out" — this asserts the wrong text on purpose
    await expect(loginPage['page'].locator('[data-test="error"]'))
      .toHaveText('Invalid credentials. Please try again.');
  });

  test('wrong product count assertion @demo-fail', async ({ authenticatedPage }) => {
    const items = authenticatedPage['page'].locator('.inventory_item');

    // SauceDemo always has 6 items — asserting 3 to force failure
    await expect(items).toHaveCount(3);
  });

  test('wrong checkout success message assertion @demo-fail', async ({
    authenticatedPage,
    cartPage,
    checkoutPage,
  }) => {
    await authenticatedPage.addProductToCart(products.backpack.name);
    await authenticatedPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCustomerInfo(checkoutInfo);
    await checkoutPage.continue();
    await checkoutPage.finish();

    // Actual message is "Thank you for your order!" — wrong text asserted on purpose
    await expect(checkoutPage['page'].locator('.complete-header'))
      .toHaveText('Order dispatched successfully!');
  });

});
