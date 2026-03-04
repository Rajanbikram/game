import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import "../../../css/user.css";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axiosInstance.delete(`/cart/item/${itemId}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const updateQty = async (itemId, quantity) => {
    try {
      await axiosInstance.put(`/cart/item/${itemId}`, { quantity });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const getTotal = () =>
    cart?.CartItems?.reduce((s, i) => s + i.Product.price * i.quantity, 0) || 0;

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="logo" onClick={() => navigate("/home")}>store.</div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => navigate("/orders")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            </button>
            <button className="icon-btn" onClick={() => navigate("/cart")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </button>
          </div>
        </div>
      </header>

      <div className="page">
        <div className="container cart-page">
          {!cart?.CartItems?.length ? (
            <div className="empty-state">
              <div className="emoji">🛒</div>
              <p>Your cart is empty</p>
              <button onClick={() => navigate("/home")}>Continue shopping</button>
            </div>
          ) : (
            <>
              <div className="back-link" onClick={() => navigate("/home")}>
                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                Back
              </div>
              <h1 className="page-title">Cart ({cart.CartItems.length})</h1>

              {cart.CartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-img" onClick={() => navigate(`/product/${item.Product.id}`)}>
                    <img src={item.Product.image} alt={item.Product.name} />
                  </div>
                  <div className="cart-item-info">
                    <div className="brand">{item.Product.brand}</div>
                    <div className="name">{item.Product.name}</div>
                    <div className="item-price">${(item.Product.price * item.quantity).toFixed(2)}</div>
                  </div>
                  <div className="cart-item-actions">
                    <button className="remove-btn" onClick={() => removeItem(item.id)}>
                      <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity - 1)}>
                        <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                      </button>
                      <span className="qty-num">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)}>
                        <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="cart-summary">
                <div className="summary-row"><span className="label">Subtotal</span><span>${getTotal().toFixed(2)}</span></div>
                <div className="summary-row"><span className="label">Shipping</span><span className="text-success">Free</span></div>
                <div className="summary-row total"><span>Total</span><span>${getTotal().toFixed(2)}</span></div>
                <button className="checkout-btn" onClick={() => navigate("/checkout")}>
                  Checkout
                  <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}