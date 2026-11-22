# Fynd Mini Checkout - Test Plan & Results Report (INR Edition 🇮🇳)

## 1. Project Overview & Scope
The **Fynd Mini Checkout** is an attractive, colorful, single-page e-commerce checkout interface built using **React 19**, **Vite**, and styled with modern gradients and Indian Rupee (`₹`) pricing.

It features two fixed-price products, real-time quantity adjustments, reactive line and order totals in INR (`₹`), required customer name validation, and an order confirmation screen with a unique tracking reference.

---

## 2. Key Checkout Risks & Prioritization

| Priority | Risk | Description | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **P0 (Critical)** | **Duplicate Orders / Double Billing** | User rapidly clicks "Place Order" multiple times, creating duplicate transactions. | Synchronous re-entry guard (`if (isSubmitting \|\| confirmedOrder) return;`) and immediate button disablement. |
| **P0 (Critical)** | **Pricing & Total Calculation Inaccuracies** | Line totals (`quantity × unit price`) or order total deviate during quantity adjustments in INR (`₹`). | Deterministic calculation from single-source-of-truth state, verified via exact Playwright assertion checks. |
| **P1 (High)** | **Invalid / Incomplete Submissions** | Customers checkout with an empty cart or without providing mandatory Full Name. | Block submission with clear, accessible validation banners. |
| **P1 (High)** | **Input State Loss on Validation Errors** | When validation fails, customer inputs (such as email or pincode) get wiped out. | Controlled React form state preserves all inputs. |
| **P2 (Medium)** | **Cart Mutation Edge Cases** | Decrementing an item quantity to 0 or removing items does not properly sync totals or empty-cart view. | Tested boundary transitions (1 → 0 removals, manual deletion, empty-cart restoration). |

---

## 3. Synthetic Products & Fixed Pricing (INR)

* **Product 1**: 🖱️ **Wireless Gaming Mouse**
  * Fixed Price: `₹500.00` (MRP: ₹999.00 • 50% OFF)
* **Product 2**: ⌨️ **RGB Mechanical Keyboard**
  * Fixed Price: `₹1,500.00` (MRP: ₹2,999.00 • 50% OFF)

---

## 4. Automated Browser Test Suite (Playwright)

Automated tests are in `tests/checkout.spec.js` using web-first visible assertions:

### Check 1: Successful Checkout in INR (`₹`)
- **Actions**: Adds Mouse (`₹500.00`) and Keyboard (`₹1,500.00`). Total = `₹2,000.00`. Enters "Aarav Patel", clicks Place Order.
- **Assertions**: Confirmation card displays customer name, exact total paid (`₹2,000.00`), and order reference matching `^ORD-[A-Z0-9]+-[A-Z0-9]+$`. Place order button unmounts.

### Check 2: Missing Required Field Blocks Checkout & Preserves Inputs
- **Actions**: Adds item (`₹500.00`), enters email, leaves Full Name blank, clicks Place Order.
- **Assertions**: Error banner displayed (*"Full name is required to complete your order."*). Confirmation is NOT displayed. Email is preserved. Enters name "Priya Sharma" and completes order successfully.

### Check 3: Quantity Changes Update Line & Order Totals Accurately
- **Actions**: Tests incrementing Mouse to 3 (`₹1,500.00`), total `₹3,000.00`; decrementing to 2 (`₹1,000.00`), total `₹2,500.00`; removing Keyboard, total `₹1,000.00`; decrementing to 0, resets to `₹0.00` with empty cart banner.
- **Assertions**: Exact string match on every mutation step.

### Check 4: Empty Cart & Double-Click Concurrency
- **Actions**: Submits empty cart (blocked); performs rapid double-click (`dblclick()`).
- **Assertions**: Rejects empty cart; double-click produces exactly 1 confirmation card and 1 reference ID.

---

## 5. Manual Testing Log & Exploratory Results

### Test Case M-01: Empty Cart Submission
* **Steps**: Open `http://localhost:5173/`, enter "Rohan Gupta", click "Place Order".
* **Result**: Red alert: *"Your cart is empty. Please add at least one item before checking out."* Submission blocked. (Status: **PASS**)

### Test Case M-02: Rapid Double-Click Concurrency
* **Steps**: Add product, enter name, double click Place Order button in rapid succession.
* **Result**: Button locked immediately; exactly 1 confirmation card rendered with single reference ID. (Status: **PASS**)

### Test Case M-03: Responsive UI and Rupee Symbol Integrity
* **Steps**: Inspect Indian Rupee symbol `₹` across desktop and mobile viewports.
* **Result**: Clean rendering, consistent comma separation (`₹1,500.00`, `₹2,000.00`, `₹2,500.00`, `₹3,000.00`). (Status: **PASS**)

---

## 6. Defect Log & Findings

| Defect ID | Description | Severity | Resolution / Status |
| :--- | :--- | :--- | :--- |
| **DEF-01** | Currency format previously in USD (`$`). | Enhancement | Updated to Indian Rupees (`₹`) with Indian number grouping (`en-IN`) across all products, line totals, and order summaries. |
| **DEF-02** | Double-click race condition risk. | Critical | Enforced synchronous check (`if (isSubmitting \|\| confirmedOrder) return;`) and disabled state on submit button. |
| **DEF-03** | React 19 hook purity rule on `Date.now()`. | Low | Extracted `generateOrderReference` outside component scope. |
