# Fynd Mini Checkout & Browser Test Suite (Indian Rupees 🇮🇳)

An attractive, colorful single-page checkout application and automated end-to-end browser test suite built with **React 19**, **Vite**, and **Playwright**, featuring Indian Rupee (`₹`) pricing and a modern Indian e-commerce aesthetic.

---

## 🎨 Visual & Functional Features

- **Attractive Indian E-Commerce Design**:
  - Gradient header with brand icon and 256-bit SSL security pill.
  - Festive announcement bar with Free Express Delivery across India.
  - Glowing product cards with discount badges (`50% OFF`), MRP comparison, and emoji visuals.
  - Sleek shopping bag table with tactile quantity steppers (`−` `+`) and line totals in `₹`.
  - Payment method simulator (⚡ UPI / GPay / PhonePe and 💵 Cash on Delivery).
  - Celebratory confirmation screen with confetti accents, order reference code, and breakdown.
- **Two Synthetic Products (Fixed Prices in INR)**:
  - 🖱️ **Wireless Gaming Mouse** — **₹500.00** <del>₹999.00</del>
  - ⌨️ **RGB Mechanical Keyboard** — **₹1,500.00** <del>₹2,999.00</del>
- **Error Handling & Protection**:
  - Empty cart validation.
  - Required Full Name validation with input preservation.
  - Synchronous double-click protection preventing duplicate orders.

---

## 🚀 Running the App Locally

### 1. Start Development Server
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

### 2. Run Browser Tests (Playwright)
```bash
npm test
```
*or*
```bash
npx playwright test
```

### 3. View Interactive HTML Test Report
```bash
npx playwright show-report
```

### 4. Code Quality & Build Checks
```bash
npm run lint
npm run build
```

---

## 📋 Automated Checks Summary (`tests/checkout.spec.js`)

1. **Check 1: Successful Checkout in INR (`₹`)**: Verifies adding items, entering customer name, placing order, validating order receipt summary, total paid in `₹`, and order reference format `ORD-[A-Z0-9]+-[A-Z0-9]+`.
2. **Check 2: Missing Required Field**: Verifies blank Full Name triggers *"Full name is required to complete your order."*, keeps optional email intact, and allows recovery upon entering a name.
3. **Check 3: Quantity Changes & Pricing Accuracy**: Verifies increments, decrements, item deletions, and empty-cart transitions calculate exact line totals and order totals in INR (`₹`).
4. **Check 4: Empty Cart & Double-Click Guard**: Verifies empty cart cannot be checked out, and rapid double-clicking produces only one confirmation.

---

## 📄 Test Plan
For detailed test strategies, manual test logs (empty cart and rapid double click), and defect tracking, see:
👉 [TEST_PLAN.md](file:///D:/CERTIFICATES/PROJECT/fynd-checkout/TEST_PLAN.md)
