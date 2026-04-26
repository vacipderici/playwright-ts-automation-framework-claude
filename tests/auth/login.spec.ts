import { test, expect } from '../../fixtures/testFixtures';
import { users } from '../../test-data/users';

test.describe('Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('successful login with standard user', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard());

    await inventoryPage.assertOnInventoryPage();
  });

  test('login fails for locked out user', async ({ loginPage }) => {
    await loginPage.login(users.locked());

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain('Sorry, this user has been locked out');
  });

  test('logout returns to login page', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard());
    await inventoryPage.assertOnInventoryPage();

    await inventoryPage.logout();

    await expect(loginPage['page']).toHaveURL('/');
  });
});
