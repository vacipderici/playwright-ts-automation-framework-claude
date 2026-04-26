import { test, expect } from '../../fixtures/testFixtures';
import { users } from '../../test-data/users';
import { products } from '../../test-data/products';

test.describe('Smoke Tests', () => {
  test('login page loads', async ({ loginPage }) => {
    await loginPage.goto();

    expect(await loginPage.getTitle()).toContain('Swag Labs');
  });

  test('successful login lands on inventory', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard());

    await inventoryPage.assertOnInventoryPage();
  });

  test('add product to cart updates badge', async ({ authenticatedPage }) => {
    await authenticatedPage.addProductToCart(products.backpack.name);

    expect(await authenticatedPage.getCartCount()).toBe(1);
  });

  test('cart page loads after adding item', async ({ authenticatedPage, cartPage }) => {
    await authenticatedPage.addProductToCart(products.backpack.name);
    await authenticatedPage.goToCart();

    await cartPage.assertOnCartPage();
    expect(await cartPage.getCartItemCount()).toBe(1);
  });

  test('logout redirects to login page', async ({ authenticatedPage }) => {
    await authenticatedPage.logout();
  });
});
