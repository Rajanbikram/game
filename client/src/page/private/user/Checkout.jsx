import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import "../../../css/user.css";

const paymentMethods = [
  { id: "card", label: "Credit / Debit Card" },
  { id: "esewa", label: "eSewa" },
  { id: "cod", label: "Cash on Delivery" },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get("/cart");
      if (!res.data?.CartItems?.length) {
        navigate("/cart");
        return;
      }
      setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTotal = () =>
    cart?.CartItems?.reduce((s, i) => s + i.Product.price * i.quantity, 0) || 0;

  const placeOrder = async () => {
    try {
      const orderRes = await axiosInstance.post("/orders/place");
      const orderId = orderRes.data.orderId;
      await axiosInstance.post("/payment", { orderId, method: paymentMethod });
      setPlacedOrderId(orderId);
      setOrderSuccess(true);
    } catch (err) {
      console.error(err);
    }
  };

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
        <div className="container checkout-page">
          {orderSuccess ? (
            <div className="order-success">
              <div className="success-icon">
                <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <h1>Order Placed!</h1>
              <p>Your order has been placed successfully. You can track it in your orders.</p>
              <div className="success-btns">
                <button className="btn-primary" onClick={() => navigate("/orders")}>View Orders</button>
                <button className="btn-secondary" onClick={() => navigate("/home")}>Continue Shopping</button>
              </div>
            </div>
          ) : (
            <>
              <div className="back-link" onClick={() => navigate("/cart")}>
                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                Back
              </div>
              <h1 className="page-title">Checkout</h1>

              <div className="section-title">Order Summary</div>
              {cart?.CartItems?.map((item) => (
                <div className="order-line" key={item.id}>
                  <span className="item-name">{item.Product.name} × {item.quantity}</span>
                  <span>${(item.Product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="order-total">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>

              <div className="payment-methods">
                <div className="section-title">Payment Method</div>
                {paymentMethods.map((m) => (
                  <button
                    key={m.id}
                    className={`payment-option ${paymentMethod === m.id ? "active" : ""}`}
                    onClick={() => setPaymentMethod(m.id)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <button className="place-order-btn" onClick={placeOrder}>
                Place Order · ${getTotal().toFixed(2)}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}