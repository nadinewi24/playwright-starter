import { type Page, type Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.sortSelect = page.getByTestId('product-sort-container');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async expectLoaded() {
    await expect(this.title).toHaveText('Products');
  }

  /** Fügt ein Produkt anhand seines sichtbaren Namens hinzu. */
  async addToCart(productName: string) {
    const product = this.page.getByTestId('inventory-item').filter({ hasText: productName });
    await product.getByRole('button', { name: 'Add to cart' }).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async sortBy(optionName: string) {
    await this.sortSelect.selectOption({ label: optionName });
    await expect(this.sortSelect.locator('option:checked')).toHaveText(optionName);
  }
}
