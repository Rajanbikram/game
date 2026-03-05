import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import "../../../css/user.css";

const categories = ["All", "Electronics", "Clothing", "Accessories", "Footwear", "Home & Living"];
const brands = ["Apple", "Samsung", "Nike", "Adidas", "Sony", "IKEA", "Uniqlo", "Muji"];

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts]                 = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrands, setSelectedBrands]     = useState([]);
  const [minPrice, setMinPrice]                 = useState(0);
  const [maxPrice, setMaxPrice]                 = useState(100000);
  const [search, setSearch]                     = useState("");
  const [showFilters, setShowFilters]           = useState(false);
  const [cartCount, setCartCount]               = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchCartCount();
  }, [selectedCategory, selectedBrands, minPrice, maxPrice, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (selectedBrands.length > 0)  params.brand    = selectedBrands.join(",");
      if (minPrice > 0)               params.minPrice = minPrice;
      if (maxPrice < 100000)          params.maxPrice = maxPrice;
      if (search)                     params.search   = search;
      const res = await axiosInstance.get("/products", { params });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await axiosInstance.get("/cart");
      const count = res.data.CartItems?.reduce((s, i) => s + i.quantity, 0) || 0;
      setCartCount(count);
    } catch {}
  };

  const addToCart = async (productId) => {
    try {
      await axiosInstance.post("/cart/add", { productId });
      fetchCartCount();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(100000);
    setSearch("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">store.</div>
          <div className="search-wrap">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="header-actions">

            {/* Orders */}
            <button className="icon-btn" onClick={() => navigate("/orders")} title="Orders">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7.5 4.27 9 5.15"/>
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                <path d="m3.3 7 8.7 5 8.7-5"/>
                <path d="M12 22V12"/>
              </svg>
            </button>

            {/* Cart */}
            <button className="icon-btn" onClick={() => navigate("/cart")} title="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* Logout */}
            <button className="icon-btn" onClick={handleLogout} title="Logout">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>

          </div>
        </div>
      </header>

      {/* HOME PAGE */}
      <div className="page">
        <div className="container">

          {/* Categories */}
          <div className="categories">
            {categories.map((c) => (
              <button
                key={c}
                className={`cat-btn ${selectedCategory === c ? "active" : ""}`}
                onClick={() => setSelectedCategory(c)}
              >
                {c}
              </button>
            ))}
            <button
              className={`filter-toggle ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="21" x2="14" y1="4" y2="4"/>
                <line x1="10" x2="3" y1="4" y2="4"/>
                <line x1="21" x2="12" y1="12" y2="12"/>
                <line x1="8" x2="3" y1="12" y2="12"/>
                <line x1="21" x2="16" y1="20" y2="20"/>
                <line x1="12" x2="3" y1="20" y2="20"/>
                <line x1="14" x2="14" y1="2" y2="6"/>
                <line x1="8" x2="8" y1="10" y2="14"/>
                <line x1="16" x2="16" y1="18" y2="22"/>
              </svg>
              Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="filters-panel open">
              <div className="filters-header">
                <h3>Filters</h3>
                <button className="clear-btn" onClick={clearFilters}>✕ Clear all</button>
              </div>
              <div className="filters-grid">
                <div>
                  <span className="filter-label">Price Range</span>
                  <div className="price-inputs">
                    <input
                      className="price-input" type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span style={{ color: "var(--muted-fg)", fontSize: ".875rem" }}>to</span>
                    <input
                      className="price-input" type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <span className="filter-label">Brands</span>
                  <div className="brand-chips">
                    {brands.map((b) => (
                      <button
                        key={b}
                        className={`brand-chip ${selectedBrands.includes(b) ? "active" : ""}`}
                        onClick={() => toggleBrand(b)}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Indicator */}
          {search && (
            <div className="search-indicator">
              Results for "<strong>{search}</strong>" · {products.length} products
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="loading">Loading...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="emoji">🛍</div>
              <p>No products found.</p>
              <button onClick={clearFilters}>Clear filters</button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => (
                <div className="product-card" key={p.id}>
                  <div
                    className="img-wrap"
                    onClick={() => navigate(`/product/${p.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={p.image} alt={p.name} loading="lazy" />
                  </div>
                  <div className="card-body">
                    <div className="card-info">
                      <div className="brand">{p.brand}</div>
                      <div
                        className="name"
                        onClick={() => navigate(`/product/${p.id}`)}
                      >
                        {p.name}
                      </div>
                      <div className="price-row">
                        <span className="price">Rs. {p.price}</span>
                        {p.originalPrice && (
                          <span className="old-price">Rs. {p.originalPrice}</span>
                        )}
                      </div>
                      {!p.inStock && <div className="oos">Out of stock</div>}
                    </div>
                    <button
                      className="add-btn"
                      onClick={() => addToCart(p.id)}
                      disabled={!p.inStock}
                    >
                      <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                        <path d="M3 6h18"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}