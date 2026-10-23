import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { checkoutData } from '../test-data/users';

// Diese Tests starten dank auth.setup.ts bereits eingeloggt.
test.describe('Bestellung (End-to-End)', () => {
  test('Produkt in den Warenkorb legen', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.goto();
    await inventory.expectLoaded();
    await inventory.addToCart('Sauce Labs Backpack');
    await expect(inventory.cartBadge).toHaveText('1');
  });

  test('kompletter Bestellablauf', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const checkout = new CheckoutPage(page);

    // Arrange: Ausgangslage herstellen
    await inventory.goto();
    await inventory.addToCart('Sauce Labs Backpack');

    // Act: Ablauf durchführen
    await inventory.openCart();
    await checkout.checkoutButton.click();
    await checkout.fillAddress(checkoutData);
    await checkout.continueButton.click();
    await checkout.finishButton.click();

    // Assert: Ergebnis prüfen
    await checkout.expectOrderComplete();
  });

  test('Checkout ohne Postleitzahl zeigt Fehler', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const checkout = new CheckoutPage(page);
    await inventory.goto();
    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.openCart();
    await checkout.checkoutButton.click();
    await checkout.fillAddress({ ...checkoutData, postalCode: '' });
    await checkout.continueButton.click();
    await expect(page.getByTestId('error')).toContainText('Postal Code is required');
  });
});
