import { useState } from 'react';
import './App.css';

function generateOrderReference() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${randomSuffix}`;
}

const PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Mouse',
    description: 'Ergonomic 2.4GHz optical wireless mouse with silent clicks.',
    price: 25.0,
    emoji: '🖱️',
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    description: 'Compact 75% tactile mechanical keyboard with backlight.',
    price: 75.0,
    emoji: '⌨️',
  },
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
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
      items: [...cart],
      total: orderTotal,
      placedAt: new Date().toLocaleTimeString(),
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
    setErrorMessage('');
    setIsSubmitting(false);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Fynd Mini Store</h1>
          <p className="subtitle">Fast, reliable single-page checkout</p>
        </div>
      </header>

      <main className="main-content">
        {confirmedOrder ? (
          /* Confirmation Screen */
          <section className="confirmation-card" data-testid="order-confirmation">
            <div className="confirmation-badge">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p className="confirmation-thank-you">
              Thank you, <strong data-testid="confirmed-customer-name">{confirmedOrder.customerName}</strong>!
              Your order has been confirmed.
            </p>

            <div className="reference-box">
              <span className="reference-label">Order Reference:</span>
              <span className="reference-number" data-testid="order-reference">
                {confirmedOrder.reference}
              </span>
            </div>

            <div className="confirmation-summary">
              <h3>Items Purchased</h3>
              <ul>
                {confirmedOrder.items.map((item) => (
                  <li key={item.id} className="summary-item">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="confirmation-total">
                <strong>Total Paid:</strong>
                <strong data-testid="confirmed-total">
                  ${confirmedOrder.total.toFixed(2)}
                </strong>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleStartNewOrder}
              data-testid="start-new-order-btn"
            >
              Place Another Order
            </button>
          </section>
        ) : (
          /* Checkout Journey */
          <div className="checkout-grid">
            {/* Left Column: Products & Cart */}
            <div className="products-cart-column">
              {/* Product Catalog */}
              <section className="card">
                <h2>1. Select Products</h2>
                <div className="products-list">
                  {PRODUCTS.map((product) => (
                    <div
                      key={product.id}
                      className="product-card"
                      data-testid={`product-card-${product.id}`}
                    >
                      <div className="product-icon">{product.emoji}</div>
                      <div className="product-info">
                        <h3 data-testid={`product-name-${product.id}`}>{product.name}</h3>
                        <p className="product-desc">{product.description}</p>
                        <div className="product-price" data-testid={`product-price-${product.id}`}>
                          ${product.price.toFixed(2)}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => addToCart(product)}
                        data-testid={`add-to-cart-${product.id}`}
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Cart Summary */}
              <section className="card">
                <h2>2. Your Cart</h2>
                {cart.length === 0 ? (
                  <p className="empty-cart-message" data-testid="empty-cart-message">
                    Your cart is currently empty. Please select an item above.
                  </p>
                ) : (
                  <div className="cart-table-wrapper">
                    <table className="cart-table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Line Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item) => (
                          <tr key={item.id} data-testid={`cart-row-${item.id}`}>
                            <td>
                              <strong>{item.name}</strong>
                            </td>
                            <td>${item.price.toFixed(2)}</td>
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
                                className="line-total"
                                data-testid={`line-total-${item.id}`}
                              >
                                ${(item.price * item.quantity).toFixed(2)}
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

                <div className="cart-total-box">
                  <span>Order Total:</span>
                  <span className="order-total-amount" data-testid="order-total">
                    ${orderTotal.toFixed(2)}
                  </span>
                </div>
              </section>
            </div>

            {/* Right Column: Checkout Form */}
            <div className="checkout-column">
              <section className="card">
                <h2>3. Customer Details</h2>
                <form onSubmit={handlePlaceOrder} noValidate>
                  {errorMessage && (
                    <div
                      className="alert alert-error"
                      role="alert"
                      data-testid="validation-error"
                    >
                      {errorMessage}
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
                      placeholder="e.g. John Doe"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      data-testid="input-customer-name"
                      required
                    />
                    <small className="form-hint">Required field</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="customer-email">Email Address (Optional)</label>
                    <input
                      id="customer-email"
                      type="email"
                      className="form-input"
                      placeholder="e.g. john@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      data-testid="input-customer-email"
                    />
                  </div>

                  <div className="order-summary-box">
                    <div className="summary-row">
                      <span>Items Count:</span>
                      <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
                    <div className="summary-row total-row">
                      <span>Total to Pay:</span>
                      <span data-testid="summary-total">${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-lg"
                    disabled={isSubmitting}
                    data-testid="place-order-btn"
                  >
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                  </button>

                  <p className="security-notice">
                    🔒 Guaranteed safe single-click checkout. No double charges.
                  </p>
                </form>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
