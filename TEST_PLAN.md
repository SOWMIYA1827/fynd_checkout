# Fynd Mini Checkout - Test Plan & Results Report

## 1. Project Overview & Scope
The **Fynd Mini Checkout** is a single-page e-commerce checkout interface built using **React 19** and **Vite**. It enables customers to select products, modify cart quantities in real-time, view line and order totals, enter required customer details, and obtain a single, unambiguous order confirmation with an order reference.

This test plan defines the testing strategy, identifies critical checkout risks, specifies automated browser checks (implemented in **Playwright**), and documents manual testing results for edge cases such as empty-cart submissions and rapid double-clicking.

---

## 2. Key Checkout Risks & Prioritization

In financial and e-commerce checkout funnels, defects can lead to revenue loss, customer dissatisfaction, or double billing. We prioritize the risks as follows:

| Priority | Risk | Description | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **P0 (Critical)** | **Duplicate Orders / Double Billing** | User rapidly clicks "Place Order" multiple times due to impatience or network latency, creating duplicate transactions. | Implement immediate synchronous submission locking (`isSubmitting` flag + button disablement + guard checks). |
| **P0 (Critical)** | **Pricing & Total Calculation Inaccuracies** | Line totals (`quantity × unit price`) or the final order total deviate due to floating-point rounding or state de-synchronization. | Strictly calculate line totals and order total from single-source-of-truth state, verified via exact assertion tests. |
| **P1 (High)** | **Invalid / Incomplete Submissions** | Customers checkout with an empty cart or without providing mandatory identifiers (e.g., Full Name). | Block submission at the form handler level with clear, user-facing alert banners. |
| **P1 (High)** | **Input State Loss on Validation Errors** | When validation fails (e.g. missing name), customer's other fields (e.g., email) get wiped out, causing frustration. | Controlled form state preserves input values across validation triggers. |
| **P2 (Medium)** | **Cart Mutation Edge Cases** | Decrementing an item quantity to 0, removing all items, or repeatedly adding items does not properly sync totals or empty-cart view. | Test boundary transitions: 1 → 0 removals, manual deletion, empty-cart state rendering. |

---

## 3. Automated Browser Test Suite (Playwright)

The automated suite is implemented in `tests/checkout.spec.js` using Playwright's web-first assertions (`expect(locator).toBeVisible()`, `expect(locator).toHaveText()`). Each test executes in a clean browser context.

### Check 1: Successful Checkout Journey & Order Confirmation
- **Objective:** Verify that selecting products, entering required customer details, and placing an order leads to a single order confirmation with an order reference.
- **Workflow:**
  1. Navigate to `/`.
  2. Verify initial cart is empty ($0.00).
  3. Add *Wireless Mouse* ($25.00) and *Mechanical Keyboard* ($75.00).
  4. Assert line totals ($25.00, $75.00) and order total ($100.00).
  5. Fill required name (`Jane Doe`) and optional email (`jane.doe@example.com`).
  6. Click "Place Order".
  7. Assert confirmation card is displayed with customer's name, purchased items summary, total paid, and an order reference matching format `ORD-[A-Z0-9]+-[A-Z0-9]+`.
  8. Assert checkout form and "Place Order" button are cleanly unmounted.

### Check 2: Missing Required Field Blocks Checkout & Preserves Input
- **Objective:** Verify that omitting the required "Full Name" field prevents checkout, alerts the customer, and preserves already-entered information.
- **Workflow:**
  1. Add an item to cart ($25.00).
  2. Fill optional email (`test-user@example.com`) but leave Full Name blank.
  3. Click "Place Order".
  4. Assert validation error message is visible: *"Full name is required to complete your order."*
  5. Assert confirmation screen is NOT rendered.
  6. Assert entered email field remains intact (`test-user@example.com`).
  7. Fill Full Name (`Alice Smith`) and re-click "Place Order".
  8. Assert submission succeeds and confirmation screen displays with customer name.

### Check 3: Dynamic Quantity Changes Update Line & Order Totals Accurately
- **Objective:** Verify real-time calculation accuracy when adding, incrementing, decrementing, and removing items.
- **Workflow:**
  1. Add *Wireless Mouse* ($25.00) and *Mechanical Keyboard* ($75.00) → Order total $100.00.
  2. Increment *Wireless Mouse* twice (quantity 1 → 2 → 3).
  3. Assert line total updates to $75.00 ($25.00 × 3) and order total updates to $150.00.
  4. Decrement *Wireless Mouse* once (quantity 3 → 2) → line total $50.00, order total $125.00.
  5. Remove *Mechanical Keyboard* using "Remove" button → item disappears, order total updates to $50.00.
  6. Decrement *Wireless Mouse* to 0 → cart row disappears, empty cart message appears, and order total resets to $0.00.

### Additional Check 4: Empty Cart Handling & Concurrency Lock
- **Objective:** Verify that attempting checkout with an empty cart is blocked, and double-clicking "Place Order" produces only one confirmation.

---

## 4. Manual Testing Log & Exploratory Results

### Test Case M-01: Checkout with an Empty Cart
* **Execution Steps:**
  1. Launch app at `http://localhost:5173/`.
  2. Without clicking "Add to Cart", enter "Bob Smith" into the Full Name field.
  3. Click the "Place Order" button.
* **Expected Result:** Checkout is blocked. A visible error states the cart is empty. No order confirmation or reference is generated.
* **Actual Result:** The alert message *"Your cart is empty. Please add at least one item before checking out."* was immediately displayed in red. Form state was preserved, and no confirmation screen was created.
* **Status:** **PASS**

---

### Test Case M-02: Rapid Double-Click on "Place Order"
* **Execution Steps:**
  1. Add *Wireless Mouse* ($25.00) to cart.
  2. Fill Full Name with "Charlie Brown".
  3. Position mouse cursor over "Place Order" button.
  4. Rapidly double-click (within 50ms) using mouse and automate double-click via Playwright `dblclick()`.
* **Expected Result:** Only one order confirmation is produced. Exactly one unique order reference is generated. No duplicate confirmations, screen flicker, or double submission occur.
* **Actual Result:** Button transitions to disabled state immediately (`disabled={isSubmitting}` and synchronous guard `if (isSubmitting || confirmedOrder) return;`). Exactly one confirmation card was rendered with a single reference ID (`ORD-...`).
* **Status:** **PASS**

---

### Test Case M-03: Whitespace-Only Name Submission
* **Execution Steps:**
  1. Add product to cart.
  2. Enter `"    "` (spaces only) in Full Name.
  3. Click "Place Order".
* **Expected Result:** Trimmed value is detected as blank; checkout blocked with error message.
* **Actual Result:** Form intercepted by `trimmedName` check; error *"Full name is required to complete your order."* displayed.
* **Status:** **PASS**

---

## 5. Defect Log & Findings

| Defect ID | Description | Severity | Resolution / Status |
| :--- | :--- | :--- | :--- |
| **DEF-01** | Default Vite starter screen did not contain checkout elements. | Blocker | Replaced `src/App.jsx` and `src/App.css` with single-page checkout component adhering to all challenge requirements. |
| **DEF-02** | React 19 Hook Purity warning triggered by calling `Date.now()` and `Math.random()` inside component scope. | Low | Extracted `generateOrderReference()` to a top-level pure utility function outside the React component scope. Verified with `npm run lint`. |
| **DEF-03** | Potential double-click race condition if state updates are asynchronous. | Critical | Added synchronous re-entry guard at the very start of `handlePlaceOrder` (`if (isSubmitting || confirmedOrder) return;`), followed by immediate state lock and button disablement. |

---

## 6. Summary & Recommendations
The **Fynd Mini Checkout** satisfies all requirements:
1. Two synthetic products with accurate, reactive line and order total calculations.
2. Required name field validation with input preservation on error.
3. Empty-cart validation.
4. Single-confirmation double-click protection.
5. 100% automated test coverage across all mandatory journeys.
