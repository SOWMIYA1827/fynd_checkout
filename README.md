# Fynd Mini Checkout & Browser Test Suite

A modern, responsive e-commerce checkout application with automated end-to-end browser testing, developed as part of the **Fynd Hiring Hackathon – SDET Intern Track**.

Built using **React 19, Vite, JavaScript, and Playwright**, this project demonstrates checkout functionality, input validation, accurate price calculations, duplicate-order prevention, and automated browser testing.

---

## Project Overview

The Mini Checkout application simulates a real-world online shopping experience where customers can select products, manage quantities, review their order totals, and complete checkout.

The primary objective is to ensure a reliable checkout experience by identifying common user errors and validating critical customer journeys through automated browser tests.

The application uses two synthetic products with fixed prices and Indian Rupee (₹) currency formatting. No backend, database, payment gateway, or external services are required.

## Application Preview

![Fynd Mini Checkout - GitHub Repository Screenshot](.Screenshot 2026-11-22 184252/.png)

*Project repository overview. Add your uploaded screenshot to the `screenshots` folder using the filename `github-repository.png`.*

## Key Features

### 1. Product Management
- Two synthetic products with fixed prices.
- Add and remove products from the shopping cart.
- Increase or decrease product quantities.
- Automatic line-total calculations.
- Discount badges and original price comparisons.

### 2. Shopping Cart & Order Summary
- Dynamic cart updates.
- Real-time quantity calculations.
- Automatic subtotal and order-total updates.
- Indian Rupee (₹) currency formatting.
- Accurate price calculations.

### 3. Checkout Validation
- Required customer full-name field.
- Clear validation messages for missing information.
- Prevents checkout when the cart is empty.
- Preserves customer-entered information after validation errors.

### 4. Order Confirmation
- Generates a unique order reference.
- Displays order confirmation after successful checkout.
- Prevents duplicate orders caused by rapid double-clicking.
- Displays the completed order summary.

### 5. Browser Automation
- Automated end-to-end testing using Playwright.
- Customer-facing UI assertions.
- Validation of successful and unsuccessful checkout scenarios.
- Verification of exact order totals.
- Duplicate-order prevention checks.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | Frontend development |
| Vite | Development server and build tool |
| JavaScript | Application logic |
| CSS | Responsive UI and styling |
| Playwright | Browser automation |
| ESLint | Code quality and linting |
| Git & GitHub | Version control |

---

## Product Information

The application contains two synthetic products with fixed prices.

| Product | Price | Original Price |
|---|---:|---:|
| Wireless Gaming Mouse | ₹500.00 | ₹999.00 |
| RGB Mechanical Keyboard | ₹1,500.00 | ₹2,999.00 |

All prices are fixed for testing purposes.

---

## Project Structure

```text
fynd-checkout/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── ProductList.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   └── Confirmation.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── tests/
│   └── checkout.spec.js
│
├── screenshots/
│
├── README.md
├── TEST_PLAN.md
├── playwright.config.js
├── eslint.config.js
├── package.json
└── package-lock.json
```

---

## Installation & Setup

### Prerequisites

- Node.js
- npm
- Git
- Visual Studio Code

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd fynd-checkout
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173/
```

---

## Browser Testing with Playwright

### Install Playwright

```bash
npm install -D @playwright/test
```

Install Chromium:

```bash
npx playwright install chromium
```

### Execute Automated Tests

```bash
npx playwright test
```

Alternatively, if the test script is configured:

```bash
npm test
```

### View the HTML Test Report

```bash
npx playwright show-report
```

### Run Tests in Browser UI Mode

```bash
npx playwright test --ui
```

---

## Automated Test Coverage

The test suite focuses on the most important checkout risks.

| Test Case | Expected Result |
|---|---|
| Successful Checkout | Order confirmation and unique reference are displayed |
| Missing Required Field | Checkout is blocked with a clear validation message |
| Quantity Update | Exact line totals and order totals are calculated |
| Empty Cart | Checkout is prevented |
| Rapid Double-Click | Only one order confirmation is generated |

### Detailed Test Scenarios

**Test 01 – Successful Checkout**
- Add products to the cart.
- Enter the customer's name.
- Click Place Order.
- Verify the success confirmation.
- Verify the order reference and total.

**Test 02 – Missing Required Field**
- Add a product to the cart.
- Leave the full-name field empty.
- Attempt checkout.
- Verify the validation message.
- Verify previously entered information is preserved.

**Test 03 – Quantity and Price Accuracy**
- Add a product.
- Increase its quantity.
- Verify the exact line total.
- Verify the updated order total.
- Decrease the quantity and verify the calculation again.

**Test 04 – Empty Cart and Duplicate Submission**
- Attempt checkout with an empty cart.
- Verify that checkout is blocked.
- Rapidly click Place Order.
- Verify that only one confirmation is generated.

Each automated test should begin with a clean application state to avoid interference between test cases.

---

## Test Plan & Manual Testing

A separate test plan documents the test strategy, execution steps, expected results, and manual testing observations.

See **[TEST_PLAN.md](./TEST_PLAN.md)** for:

- Test objectives and scope.
- Functional test scenarios.
- Risk-based testing priorities.
- Manual empty-cart testing.
- Rapid double-click testing.
- Actual results and defect tracking.

Defects should be documented only when observed and reproducible.

---

## Code Quality & Production Build

Run ESLint to check code quality:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

---

## Project Objectives

This project demonstrates practical skills in:

- React application development.
- Functional testing.
- End-to-end browser automation.
- Test case design and execution.
- UI validation and assertions.
- Boundary-condition testing.
- Error handling and debugging.
- Quality assurance and defect reporting.

## Hackathon Track

**Fynd Hiring Hackathon – SDET Intern**

Challenge: Mini Checkout and Browser Test Suite

The project focuses on building a functional checkout experience and validating its reliability through reproducible browser automation.

---

## Author

**Sowmiya M**

GitHub: [SOWMIYA1827](https://github.com/SOWMIYA1827)

---

*Built with a focus on reliable checkout experiences, meaningful test coverage, and quality-driven development.*
