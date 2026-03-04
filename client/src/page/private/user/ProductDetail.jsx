import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import "../../../css/user.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      await axiosInstance.post("/cart/add", { productId: product.id });
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="loading">Product not found.</div>;

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
        <div className="container">
          <div className="back-link" onClick={() => navigate("/home")}>
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Back
          </div>
          <div className="detail-grid">
            <div className="detail-img">
              <img src={product.image} alt={product.name} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="detail-brand">{product.brand}</div>
              <div className="detail-name">{product.name}</div>
              <div className="detail-rating">
                <span className="stars">★ {product.rating}</span>
                <span className="reviews">({product.reviews?.toLocaleString()} reviews)</span>
              </div>
              <div className="detail-price">
                <span className="current">${product.price}</span>
                {product.originalPrice && <span className="original">${product.originalPrice}</span>}
              </div>
              <div className="detail-desc">{product.description}</div>
              <div className="specs">
                <h2>Specifications</h2>
                {product.specifications && Object.entries(product.specifications).map(([k, v]) => (
                  <div className="spec-row" key={k}>
                    <span className="key">{k}</span>
                    <span className="val">{v}</span>
                  </div>
                ))}
              </div>
              <button
                className="detail-add"
                onClick={addToCart}
                disabled={!product.inStock}
              >
                {added ? "✓ Added" : product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}