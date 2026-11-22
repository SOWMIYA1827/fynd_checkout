import { test, expect } from '@playwright/test';

test.describe('Fynd Mini Checkout - Indian Rupees (₹) Journey Tests', () => {
  // Ensure each test starts with a clean state
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  /**
   * Check 1: Verify a successful checkout produces an order confirmation in INR (₹)
   */
  test('Check 1: successful checkout produces order confirmation with unique reference in INR', async ({ page }) => {
    // 1. Verify initial clean state
    await expect(page.getByTestId('empty-cart-message')).toBeVisible();
    await expect(page.getByTestId('order-total')).toHaveText('₹0.00');

    // 2. Add products to cart (Mouse ₹500.00, Keyboard ₹1,500.00)
    await page.getByTestId('add-to-cart-1').click();
    await page.getByTestId('add-to-cart-2').click();

    // 3. Verify cart items and totals
    await expect(page.getByTestId('cart-row-1')).toBeVisible();
    await expect(page.getByTestId('line-total-1')).toHaveText('₹500.00');
    await expect(page.getByTestId('cart-row-2')).toBeVisible();
    await expect(page.getByTestId('line-total-2')).toHaveText('₹1,500.00');
    await expect(page.getByTestId('order-total')).toHaveText('₹2,000.00');

    // 4. Fill customer details (required name + optional email)
    await page.getByTestId('input-customer-name').fill('Aarav Patel');
    await page.getByTestId('input-customer-email').fill('aarav.patel@example.com');

    // 5. Place the order
    const placeOrderBtn = page.getByTestId('place-order-btn');
    await expect(placeOrderBtn).toBeEnabled();
    await placeOrderBtn.click();

    // 6. Assertions on what customer sees upon confirmation
    const confirmation = page.getByTestId('order-confirmation');
    await expect(confirmation).toBeVisible();
    await expect(page.getByRole('heading', { name: /Order Placed Successfully!/i })).toBeVisible();
    await expect(page.getByTestId('confirmed-customer-name')).toHaveText('Aarav Patel');

    // Verify valid order reference format (ORD-<timestamp>-<suffix>)
    const referenceElement = page.getByTestId('order-reference');
    await expect(referenceElement).toBeVisible();
    const referenceText = await referenceElement.innerText();
    expect(referenceText).toMatch(/^ORD-[A-Z0-9]+-[A-Z0-9]+$/);

    // Verify confirmation total in INR
    await expect(page.getByTestId('confirmed-total')).toHaveText('₹2,000.00');

    // Verify checkout form is replaced and Place Order button is no longer active
    await expect(page.getByTestId('place-order-btn')).not.toBeVisible();
  });

  /**
   * Check 2: Verify a missing required field blocks checkout
   */
  test('Check 2: missing required field blocks checkout, displays validation error, and preserves inputs', async ({ page }) => {
    // 1. Add product to cart so cart is valid
    await page.getByTestId('add-to-cart-1').click();
    await expect(page.getByTestId('order-total')).toHaveText('₹500.00');

    // 2. Fill optional email but leave required Full Name completely blank
    await page.getByTestId('input-customer-email').fill('test-user@example.com');
    await page.getByTestId('input-customer-name').fill('');

    // 3. Attempt to place order
    await page.getByTestId('place-order-btn').click();

    // 4. Assert customer sees clear validation message
    const errorAlert = page.getByTestId('validation-error');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toHaveText(/Full name is required to complete your order/i);

    // 5. Assert customer is NOT redirected to confirmation screen
    await expect(page.getByTestId('order-confirmation')).not.toBeVisible();

    // 6. Assert previously entered input is preserved (not wiped out)
    await expect(page.getByTestId('input-customer-email')).toHaveValue('test-user@example.com');

    // 7. Recover by entering name: error should clear and order should succeed
    await page.getByTestId('input-customer-name').fill('Priya Sharma');
    await page.getByTestId('place-order-btn').click();

    // 8. Order now succeeds
    await expect(page.getByTestId('order-confirmation')).toBeVisible();
    await expect(page.getByTestId('confirmed-customer-name')).toHaveText('Priya Sharma');
  });

  /**
   * Check 3: Verify a quantity change updates the exact line total and order total
   */
  test('Check 3: quantity change updates line total and order total accurately in INR', async ({ page }) => {
    // 1. Add Wireless Gaming Mouse (₹500.00)
    await page.getByTestId('add-to-cart-1').click();
    await expect(page.getByTestId('item-quantity-1')).toHaveText('1');
    await expect(page.getByTestId('line-total-1')).toHaveText('₹500.00');
    await expect(page.getByTestId('order-total')).toHaveText('₹500.00');

    // 2. Add Mechanical Keyboard (₹1,500.00)
    await page.getByTestId('add-to-cart-2').click();
    await expect(page.getByTestId('item-quantity-2')).toHaveText('1');
    await expect(page.getByTestId('line-total-2')).toHaveText('₹1,500.00');
    await expect(page.getByTestId('order-total')).toHaveText('₹2,000.00');

    // 3. Increment Wireless Mouse quantity twice (1 -> 2 -> 3)
    await page.getByTestId('increase-qty-1').click();
    await expect(page.getByTestId('item-quantity-1')).toHaveText('2');
    await expect(page.getByTestId('line-total-1')).toHaveText('₹1,000.00');
    await expect(page.getByTestId('order-total')).toHaveText('₹2,500.00');

    await page.getByTestId('increase-qty-1').click();
    await expect(page.getByTestId('item-quantity-1')).toHaveText('3');
    await expect(page.getByTestId('line-total-1')).toHaveText('₹1,500.00');
    await expect(page.getByTestId('order-total')).toHaveText('₹3,000.00');

    // 4. Decrement Wireless Mouse quantity once (3 -> 2)
    await page.getByTestId('decrease-qty-1').click();
    await expect(page.getByTestId('item-quantity-1')).toHaveText('2');
    await expect(page.getByTestId('line-total-1')).toHaveText('₹1,000.00');
    await expect(page.getByTestId('order-total')).toHaveText('₹2,500.00');

    // 5. Remove Mechanical Keyboard completely using Remove button
    await page.getByTestId('remove-item-2').click();
    await expect(page.getByTestId('cart-row-2')).not.toBeVisible();
    await expect(page.getByTestId('order-total')).toHaveText('₹1,000.00');

    // 6. Remove remaining item using decrease button to 0
    await page.getByTestId('decrease-qty-1').click(); // 2 -> 1
    await expect(page.getByTestId('item-quantity-1')).toHaveText('1');
    await expect(page.getByTestId('order-total')).toHaveText('₹500.00');

    await page.getByTestId('decrease-qty-1').click(); // 1 -> 0 (removed)
    await expect(page.getByTestId('cart-row-1')).not.toBeVisible();
    await expect(page.getByTestId('empty-cart-message')).toBeVisible();
    await expect(page.getByTestId('order-total')).toHaveText('₹0.00');
  });

  /**
   * Additional Check 4: Empty cart blocked & Rapid double-click protection
   */
  test('Check 4: empty cart blocks checkout and rapid double-click prevents duplicate confirmations', async ({ page }) => {
    // 1. Attempt checkout with empty cart
    await page.getByTestId('input-customer-name').fill('Rohan Gupta');
    await page.getByTestId('place-order-btn').click();

    // 2. Validate empty cart rejection
    const errorAlert = page.getByTestId('validation-error');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toHaveText(/Your cart is empty/i);
    await expect(page.getByTestId('order-confirmation')).not.toBeVisible();

    // 3. Add item to make cart valid
    await page.getByTestId('add-to-cart-1').click();

    // 4. Test rapid double click
    const placeOrderBtn = page.getByTestId('place-order-btn');
    await placeOrderBtn.dblclick();

    // 5. Confirm only one confirmation card appears
    await expect(page.getByTestId('order-confirmation')).toHaveCount(1);
    await expect(page.getByTestId('order-reference')).toHaveCount(1);
  });
});
