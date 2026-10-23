import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Sortierung', () => {
  test('nach Preis aufsteigend: günstigstes Produkt zuerst', async ({ page }) => {
    // Arrange
    const inventory = new InventoryPage(page);
    await inventory.goto();

    // Act
    await inventory.sortBy('Price (low to high)');

    // Assert
    await expect(page.getByTestId('inventory-item-price').first()).toHaveText('$7.99');
  });

  test('nach Preis aufsteigend: alle Preise sind sortiert', async ({ page }) => {
    // Arrange
    const inventory = new InventoryPage(page);
    await inventory.goto();

    // Act
    await inventory.sortBy('Price (low to high)');

    // Assert
    const priceTexts = await page.getByTestId('inventory-item-price').allTextContents();
    const prices = priceTexts.map((text) => parseFloat(text.replace('$', '')));
    const expected = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(expected);
  });
});