import { useState } from 'react';
import './App.css';

function generateOrderReference() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${randomSuffix}`;
}

function formatINR(val) {
  return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Gaming Mouse',
    description: 'Ergonomic 2.4GHz optical wireless mouse with silent tactile switches.',
    originalPrice: 999.0,
    price: 500.0,
    badge: '🔥 BESTSELLER',
    emoji: '🖱️',
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    description: 'Compact 75% hot-swappable RGB tactile mechanical keyboard.',
    originalPrice: 2999.0,
    price: 1500.0,
    badge: '⚡ POPULAR',
    emoji: '⌨️',
  },
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Cart operations
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setErrorMessage('');
  };

  const updateQuantity = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Calculations
  const orderTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalOriginal = cart.reduce(
    (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
    0
  );
  const totalSavings = totalOriginal - orderTotal;

  // Order submission
  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Guard: Prevent double-click or multiple order creation
    if (isSubmitting || confirmedOrder) {
      return;
    }

    // Validation 1: Cart must not be empty
    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add at least one item before checking out.');
      return;
    }

    // Validation 2: Customer name is required
    const trimmedName = customerName.trim();
    if (!trimmedName) {
      setErrorMessage('Full name is required to complete your order.');
      return;
    }

    // Lock submission immediately to block duplicate orders
    setIsSubmitting(true);
    setErrorMessage('');

    const reference = generateOrderReference();

    const newOrder = {
      reference,
      customerName: trimmedName,
      customerEmail: customerEmail.trim(),
      pincode: pincode.trim(),
      paymentMethod,
      items: [...cart],
      total: orderTotal,
      savings: totalSavings,
      placedAt: new Date().toLocaleTimeString('en-IN'),
    };

    setConfirmedOrder(newOrder);
    setIsSubmitting(false);
  };

  // Reset to place a new order
  const handleStartNewOrder = () => {
    setConfirmedOrder(null);
    setCart([]);
    setCustomerName('');
    setCustomerEmail('');
    setPincode('');
    setErrorMessage('');
    setIsSubmitting(false);
  };

  return (
    <div className="store-wrapper">
      {/* Top Festive / Perks Banner */}
      <div className="announcement-bar">
        <span>🇮🇳 Mega India Tech Sale • <strong>FREE Express Delivery</strong> on all orders • 100% Genuine Products</span>
      </div>

      <div className="app-container">
        {/* Colorful Modern Header */}
        <header className="app-header">
          <div className="brand-logo">
            <span className="brand-icon">🛍️</span>
            <div>
              <h1 className="brand-title">
                Fynd <span className="gradient-text">Mini Checkout</span>
              </h1>
              <p className="subtitle">Single-page lightning checkout in Indian Rupees (₹)</p>
            </div>
          </div>
          <div className="header-badge">
            <span className="secure-pill">🔒 256-Bit SSL Encrypted</span>
          </div>
        </header>

        <main className="main-content">
          {confirmedOrder ? (
            /* Colorful Order Confirmation Card */
            <section className="confirmation-card" data-testid="order-confirmation">
              <div className="confetti-decorations" aria-hidden="true">
                <span className="confetti c1">🎉</span>
                <span className="confetti c2">✨</span>
                <span className="confetti c3">🎊</span>
              </div>

              <div className="confirmation-badge">✓</div>
              <h2 className="confirmation-title">Order Placed Successfully!</h2>
              <p className="confirmation-thank-you">
                Dhanyavaad, <strong data-testid="confirmed-customer-name">{confirmedOrder.customerName}</strong>! Your order is confirmed and will be dispatched via Express Courier.
              </p>

              <div className="reference-box">
                <span className="reference-label">Order Reference ID</span>
                <span className="reference-number" data-testid="order-reference">
                  {confirmedOrder.reference}
                </span>
                <span className="reference-tag">Keep this reference for live tracking</span>
              </div>

              <div className="confirmation-summary">
                <div className="summary-header">
                  <h3>Order Receipt</h3>
                  <span className="payment-pill">Paid via {confirmedOrder.paymentMethod.toUpperCase()}</span>
                </div>
                <ul className="summary-list">
                  {confirmedOrder.items.map((item) => (
                    <li key={item.id} className="summary-item">
                      <div className="summary-item-left">
                        <span className="item-emoji">{item.emoji}</span>
                        <div>
                          <strong>{item.name}</strong>
                          <span className="item-qty-tag">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="summary-item-price">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="cost-breakdown">
                  <div className="cost-row">
                    <span>Shipping to {confirmedOrder.pincode ? `PIN ${confirmedOrder.pincode}` : 'India'}:</span>
                    <span className="free-tag">FREE</span>
                  </div>
                  {confirmedOrder.savings > 0 && (
                    <div className="cost-row savings-row">
                      <span>Total Savings:</span>
                      <span className="savings-tag">− {formatINR(confirmedOrder.savings)}</span>
                    </div>
                  )}
                  <div className="confirmation-total">
                    <span>Total Paid (INR):</span>
                    <strong className="grand-total-text" data-testid="confirmed-total">
                      {formatINR(confirmedOrder.total)}
                    </strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-celebrate"
                onClick={handleStartNewOrder}
                data-testid="start-new-order-btn"
              >
                🛍️ Place Another Order
              </button>
            </section>
          ) : (
            /* Checkout Funnel Grid */
            <div className="checkout-grid">
              {/* Left Column: Products & Cart */}
              <div className="products-cart-column">
                {/* 1. Products Catalog */}
                <section className="card card-glow">
                  <div className="card-header-bar">
                    <span className="step-number">1</span>
                    <h2>Featured Products</h2>
                    <span className="special-badge">Special Deals</span>
                  </div>

                  <div className="products-list">
                    {PRODUCTS.map((product) => (
                      <div
                        key={product.id}
                        className="product-card"
                        data-testid={`product-card-${product.id}`}
                      >
                        <div className="product-media">
                          <span className="product-emoji">{product.emoji}</span>
                          <span className="product-deal-badge">{product.badge}</span>
                        </div>
                        <div className="product-info">
                          <h3 data-testid={`product-name-${product.id}`}>{product.name}</h3>
                          <p className="product-desc">{product.description}</p>
                          <div className="price-tag-group">
                            <span
                              className="product-price"
                              data-testid={`product-price-${product.id}`}
                            >
                              {formatINR(product.price)}
                            </span>
                            <span className="product-mrp">{formatINR(product.originalPrice)}</span>
                            <span className="discount-pill">
                              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-add"
                          onClick={() => addToCart(product)}
                          data-testid={`add-to-cart-${product.id}`}
                        >
                          <span>+ Add to Cart</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 2. Interactive Cart Summary */}
                <section className="card">
                  <div className="card-header-bar">
                    <span className="step-number">2</span>
                    <h2>Your Shopping Bag</h2>
                    <span className="item-count-badge">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                    </span>
                  </div>

                  {cart.length === 0 ? (
                    <div className="empty-cart-box" data-testid="empty-cart-message">
                      <span className="empty-icon">🛒</span>
                      <p className="empty-cart-text">Your cart is currently empty!</p>
                      <p className="empty-cart-sub">Select an item above to start your checkout.</p>
                    </div>
                  ) : (
                    <div className="cart-table-wrapper">
                      <table className="cart-table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Line Total</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map((item) => (
                            <tr key={item.id} data-testid={`cart-row-${item.id}`}>
                              <td>
                                <div className="cart-product-cell">
                                  <span className="cell-emoji">{item.emoji}</span>
                                  <strong>{item.name}</strong>
                                </div>
                              </td>
                              <td className="price-cell">{formatINR(item.price)}</td>
                              <td>
                                <div className="qty-controls">
                                  <button
                                    type="button"
                                    className="btn-qty"
                                    onClick={() => updateQuantity(item.id, -1)}
                                    data-testid={`decrease-qty-${item.id}`}
                                    aria-label={`Decrease ${item.name} quantity`}
                                  >
                                    −
                                  </button>
                                  <span
                                    className="qty-display"
                                    data-testid={`item-quantity-${item.id}`}
                                  >
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    className="btn-qty"
                                    onClick={() => updateQuantity(item.id, 1)}
                                    data-testid={`increase-qty-${item.id}`}
                                    aria-label={`Increase ${item.name} quantity`}
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td>
                                <strong
                                  className="line-total-amount"
                                  data-testid={`line-total-${item.id}`}
                                >
                                  {formatINR(item.price * item.quantity)}
                                </strong>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn-remove"
                                  onClick={() => removeFromCart(item.id)}
                                  data-testid={`remove-item-${item.id}`}
                                  aria-label={`Remove ${item.name} from cart`}
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Reactive Order Total Box */}
                  <div className="cart-total-bar">
                    <div className="cart-total-label">
                      <span>Order Total (INR):</span>
                      <small>Inclusive of all Indian taxes (GST)</small>
                    </div>
                    <span className="order-total-amount" data-testid="order-total">
                      {formatINR(orderTotal)}
                    </span>
                  </div>
                </section>
              </div>

              {/* Right Column: Checkout Form & Summary */}
              <div className="checkout-column">
                <section className="card checkout-card">
                  <div className="card-header-bar">
                    <span className="step-number">3</span>
                    <h2>Customer & Delivery</h2>
                  </div>

                  <form onSubmit={handlePlaceOrder} noValidate>
                    {errorMessage && (
                      <div
                        className="alert alert-error"
                        role="alert"
                        data-testid="validation-error"
                      >
                        <span className="alert-icon">⚠️</span>
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="customer-name">
                        Full Name <span className="required-star">*</span>
                      </label>
                      <input
                        id="customer-name"
                        type="text"
                        className="form-input"
                        placeholder="e.g. Rahul Sharma"
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
                        data-testid="input-customer-name"
                        required
                      />
                      <small className="form-hint">Mandatory field for dispatch</small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="customer-email">Email Address (Optional)</label>
                      <input
                        id="customer-email"
                        type="email"
                        className="form-input"
                        placeholder="e.g. rahul@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        data-testid="input-customer-email"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="customer-pincode">Delivery PIN Code</label>
                      <input
                        id="customer-pincode"
                        type="text"
                        maxLength={6}
                        className="form-input"
                        placeholder="e.g. 560001 (Bangalore / Mumbai / Delhi)"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                      />
                    </div>

                    {/* Payment Options Simulation */}
                    <div className="form-group">
                      <label>Payment Method (Simulated)</label>
                      <div className="payment-options">
                        <label className={`payment-chip ${paymentMethod === 'upi' ? 'active' : ''}`}>
                          <input
                            type="radio"
                            name="payment"
                            value="upi"
                            checked={paymentMethod === 'upi'}
                            onChange={() => setPaymentMethod('upi')}
                          />
                          <span>⚡ UPI / GPay / PhonePe</span>
                        </label>
                        <label className={`payment-chip ${paymentMethod === 'cod' ? 'active' : ''}`}>
                          <input
                            type="radio"
                            name="payment"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                          />
                          <span>💵 Cash on Delivery</span>
                        </label>
                      </div>
                    </div>

                    {/* Order Price Breakdown */}
                    <div className="order-summary-box">
                      <div className="summary-row">
                        <span>Items Total:</span>
                        <span>{formatINR(orderTotal)}</span>
                      </div>
                      <div className="summary-row">
                        <span>Shipping / Delivery:</span>
                        <span className="free-tag">FREE</span>
                      </div>
                      {totalSavings > 0 && (
                        <div className="summary-row savings-row">
                          <span>Discount Savings:</span>
                          <span className="savings-tag">− {formatINR(totalSavings)}</span>
                        </div>
                      )}
                      <div className="summary-row total-row">
                        <span>Amount Payable:</span>
                        <span className="highlight-price" data-testid="summary-total">
                          {formatINR(orderTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Place Order Button */}
                    <button
                      type="submit"
                      className="btn btn-primary btn-block btn-place-order"
                      disabled={isSubmitting}
                      data-testid="place-order-btn"
                    >
                      {isSubmitting ? (
                        <span>⏳ Processing Order...</span>
                      ) : (
                        <span>🔒 Place Order • {formatINR(orderTotal)}</span>
                      )}
                    </button>

                    <div className="security-badges">
                      <span>✓ 100% Secure Checkout</span>
                      <span>✓ No Double Billing Guarantee</span>
                    </div>
                  </form>
                </section>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
