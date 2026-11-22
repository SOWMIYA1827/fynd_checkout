# Fynd Mini Checkout & Browser Test Suite

A lightweight, robust single-page checkout application and automated end-to-end browser test suite built with **React 19**, **Vite**, and **Playwright**.

---

## 📦 What Was Built

### 1. Single-Page Checkout Application (`src/App.jsx` & `src/App.css`)
- **Product Selection**: Two synthetic products with fixed pricing:
  - 🖱️ **Wireless Mouse** — `$25.00`
  - ⌨️ **Mechanical Keyboard** — `$75.00`
- **Dynamic Cart Summary**:
  - Add items to cart.
  - Increment (`+`) and decrement (`−`) item quantities in real time.
  - Remove items directly or by reducing quantity to 0.
  - Reactive recalculation of line totals (`unit price × quantity`) and overall order total.
- **Customer Details & Validation**:
  - Required field: **Full Name** (`*`).
  - Optional field: **Email Address**.
  - **Error handling**: Displays clear, accessible validation messages without wiping out customer inputs.
- **Order Placement & Double-Click Protection**:
  - Synchronous lock prevents duplicate orders or multiple confirmations on rapid button clicks.
  - Generates a unique order reference code (format: `ORD-<TIMESTAMP>-<SUFFIX>`).
  - Renders a clean order confirmation summary with customer name, items, reference ID, and total paid.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ or v24+)
- **npm** (v9+)

### Installation
Clone or navigate to the project directory:
```bash
cd d:/CERTIFICATES/PROJECT/fynd-checkout
```

Install application dependencies:
```bash
npm install
```

Install Playwright test runner and Chromium browser:
```bash
npm install -D @playwright/test
npx playwright install chromium
```

---

## 💻 Running the Application

Start the local Vite development server:
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173/
```

To create a production build and verify bundling:
```bash
npm run build
```

To run ESLint code health check:
```bash
npm run lint
```

---

## 🧪 Running the Browser Test Suite (Playwright)

The automated test suite runs headlessly against the local Vite server (auto-started via Playwright's `webServer` configuration).

### Run all tests:
```bash
npm test
```
*or*
```bash
npx playwright test
```

### View test report in browser:
```bash
npx playwright show-report
```

---

## 📋 Automated Checks Overview (`tests/checkout.spec.js`)

| Check | Scenario | Key Assertions |
| :--- | :--- | :--- |
| **Check 1** | **Successful Checkout** | Verifies adding items, entering customer name, submitting order, displaying the confirmation card, matching the order reference regex `ORD-[A-Z0-9]+-[A-Z0-9]+`, and confirming the exact total paid. |
| **Check 2** | **Missing Required Field** | Verifies leaving the Full Name blank blocks checkout, displays *"Full name is required to complete your order."*, keeps customer's optional email intact, and allows recovery upon entering a name. |
| **Check 3** | **Quantity Adjustments** | Verifies increments update line totals ($25 → $50 → $75) and order totals ($100 → $125 → $150). Verifies decrements and item removals accurately reduce totals down to $0.00 and restore empty cart state. |
| **Check 4** | **Empty Cart & Double-Click Protection** | Verifies checking out with 0 items is rejected with *"Your cart is empty"*, and rapid double-clicking produces exactly one confirmation with a single reference ID. |

---

## 📄 Test Plan & Manual Defect Report
A comprehensive test plan analyzing checkout risks, manual exploratory testing of empty-cart submissions and double-click concurrency, and defect tracking is documented in:
👉 [TEST_PLAN.md](file:///D:/CERTIFICATES/PROJECT/fynd-checkout/TEST_PLAN.md)
