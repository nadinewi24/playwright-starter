import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Sortierung', () => {
  test('nach Preis aufsteigend: günstigstes Produkt zuerst', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.goto();
    await inventory.sortBy('Price (low to high)');
    await expect(page.getByTestId('inventory-item-price').first()).toHaveText('$7.99');
  });

  test('nach Preis aufsteigend: alle Preise sind sortiert', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.goto();
    await inventory.sortBy('Price (low to high)');
    const priceTexts = await page.getByTestId('inventory-item-price').allTextContents();
    const prices = priceTexts.map((text) => parseFloat(text.replace('$', '')));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('nach Preis absteigend: teuerstes Produkt zuerst', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.goto();
    await inventory.sortBy('Price (high to low)');
    await expect(page.getByTestId('inventory-item-price').first()).toHaveText('$49.99');
  });

  test('nach Preis absteigend: alle Preise sind sortiert', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.goto();
    await inventory.sortBy('Price (high to low)');
    const priceTexts = await page.getByTestId('inventory-item-price').allTextContents();
    const prices = priceTexts.map((text) => parseFloat(text.replace('$', '')));
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});