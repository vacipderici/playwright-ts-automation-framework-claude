import { test, expect } from '../../fixtures/testFixtures';
import { products, checkoutInfo } from '../../test-data/products';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.addProductToCart(products.backpack.name);
    await authenticatedPage.goToCart();
  });

  test('complete checkout with single item', async ({ cartPage, checkoutPage }) => {
    await cartPage.assertOnCartPage();
    const cartItems = await cartPage.getCartItemNames();
    expect(cartItems).toContain(products.backpack.name);

    await cartPage.proceedToCheckout();

    await checkoutPage.assertOnStepOne();
    await checkoutPage.fillCustomerInfo(checkoutInfo);
    await checkoutPage.continue();

    await checkoutPage.assertOnStepTwo();
    const total = await checkoutPage.getOrderTotal();
    expect(total).toContain('$');

    await checkoutPage.finish();

    await checkoutPage.assertOnComplete();
    const confirmation = await checkoutPage.getConfirmationMessage();
    expect(confirmation).toContain('Thank you for your order');
  });

  test('checkout requires customer info', async ({ cartPage, checkoutPage }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.assertOnStepOne();

    await checkoutPage.continue();

    expect(await checkoutPage.isErrorVisible()).toBe(true);
  });

  test('cart shows correct item before checkout', async ({ cartPage }) => {
    await cartPage.assertOnCartPage();

    const items = await cartPage.getCartItemNames();
    expect(items).toHaveLength(1);
    expect(items[0]).toBe(products.backpack.name);
  });

  test('continue shopping from cart returns to inventory', async ({ cartPage }) => {
    await cartPage.continueShopping();
  });
});
