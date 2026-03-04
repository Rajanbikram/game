import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import "../../../css/user.css";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
        <div className="container orders-page">
          <div className="back-link" onClick={() => navigate("/home")}>
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Back to shop
          </div>
          <h1 className="page-title">Your Orders</h1>

          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="emoji">📦</div>
              <p>No orders yet</p>
            </div>
          ) : (
            orders.map((o) => (
              <div className="order-card" key={o.id}>
                <div className="order-card-header">
                  <div>
                    <div className="order-id">{o.id}</div>
                    <div className="order-date">{o.createdAt?.split("T")[0]}</div>
                  </div>
                  <span className={`status-badge status-${o.status}`}>{o.status}</span>
                </div>
                <div className="order-card-footer">
                  <span className="items-count">
                    {o.OrderItems?.length} item{o.OrderItems?.length > 1 ? "s" : ""}
                  </span>
                  <span className="order-total">${o.total?.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}