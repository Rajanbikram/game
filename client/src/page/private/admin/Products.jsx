import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";

const ITEMS_PER_PAGE = 6;
const emptyForm = {
  name: "", category: "",
  price: "", stock: "",
  description: "", image: "",
};

export default function Products({ showToast }) {
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [modal,      setModal]      = useState(null);
  const [selected,   setSelected]   = useState(null);
  const [form,       setForm]       = useState(emptyForm);
  const [page,       setPage]       = useState(1);
  const [imgPreview, setImgPreview] = useState("");

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/admin/products");
      setProducts(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const openAdd = () => {
    setForm(emptyForm); setImgPreview(""); setModal("add");
  };
  const openEdit = (p) => {
    setSelected(p);
    setForm({
      name: p.name, category: p.category,
      price: p.price, stock: p.stock || "",
      description: p.description, image: p.image || "",
    });
    setImgPreview(p.image || "");
    setModal("edit");
  };
  const openDelete = (p) => { setSelected(p); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImgPreview(ev.target.result);
        setForm(f => ({ ...f, image: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      if (modal === "add") {
        await axiosInstance.post("/admin/products", form);
        showToast("Product added!", "success");
      } else {
        await axiosInstance.put(`/admin/products/${selected.id}`, form);
        showToast("Product updated!", "success");
      }
      closeModal(); fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || "Error saving product.", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/admin/products/${selected.id}`);
      showToast("Product deleted!", "success");
      closeModal(); fetchProducts();
    } catch (err) {
      showToast("Error deleting product.", "error");
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    border: "1px solid #d1d5db", borderRadius: 8,
    fontSize: 14, outline: "none",
    fontFamily: "inherit", boxSizing: "border-box",
  };
  const labelStyle = {
    display: "block", fontSize: 13,
    fontWeight: 500, marginBottom: 6, color: "#374151",
  };

  return (
    <div className="space-y">

      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add Product
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 280 }}>
        <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "var(--muted)" }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          style={{ width: "100%", paddingLeft: 32, height: 34, border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, outline: "none", background: "var(--muted-bg)" }}
          placeholder="Search products..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="loading"><div className="spinner"></div>Loading...</div>
      ) : paginated.length === 0 ? (
        <div className="loading">No products found.</div>
      ) : (
        <>
          <div className="grid grid-3">
            {paginated.map(p => (
              <div className="card" key={p.id}>
                <div className="product-img">
                  {p.image
                    ? <img src={p.image} alt={p.name} />
                    : <div className="emoji">📦</div>}
                </div>
                <div className="product-info">
                  <div className="product-header">
                    <div>
                      <div className="product-name">{p.name}</div>
                      <div className="product-cat">{p.category}</div>
                    </div>
                    <div className="product-actions">
                      <button className="btn-ghost" onClick={() => openEdit(p)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className="btn-danger" onClick={() => openDelete(p)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="product-desc">{p.description}</div>
                  <div className="product-footer">
                    <span className="product-price">Rs. {p.price}</span>
                    <span className="product-stock">Stock: {p.stock ?? "N/A"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`page-btn ${page === i + 1 ? "active" : ""}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── ADD / EDIT MODAL ── */}
      {(modal === "add" || modal === "edit") && (
        <div
          className="modal-overlay open"
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}        >
          <div style={{
            background: "white", width: "90%", maxWidth: 480,
            borderRadius: 12, boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            overflow: "hidden",
          }}>

            {/* Header */}
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid #e5e7eb",
              fontSize: 18, fontWeight: 700, color: "#111827",
            }}>
              {modal === "add" ? "Add New Product" : "Edit Product"}
            </div>

            {/* Body */}
            <div style={{ padding: 24, maxHeight: "65vh", overflowY: "auto" }}>

              {/* Image Upload */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Product Image</label>
                <div
                  onClick={() => document.getElementById("prod-img").click()}
                  style={{
                    border: "2px dashed #d1d5db", borderRadius: 10,
                    height: 140, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    cursor: "pointer", background: "#fafafa",
                    transition: "all 0.2s", overflow: "hidden",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#f3f4f6";
                    e.currentTarget.style.borderColor = "#3b72e9";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "#fafafa";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                >
                  {imgPreview ? (
                    <img src={imgPreview} alt="Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="#9ca3af" strokeWidth="1.5" width="40" height="40">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                      </svg>
                      <div style={{ color: "#6b7280", fontSize: 13, marginTop: 6 }}>
                        Click to upload image
                      </div>
                    </>
                  )}
                </div>
                <input
                  type="file" id="prod-img" accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </div>

              {/* Name */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Name</label>
                <input
                  style={inputStyle}
                  type="text" placeholder="Product name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>

              {/* Category */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Category</label>
                <input
                  style={inputStyle}
                  type="text" placeholder="Category"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                />
              </div>

              {/* Price & Stock */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Price (Rs.)</label>
                  <input
                    style={inputStyle}
                    type="number" placeholder="0"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Stock</label>
                  <input
                    style={inputStyle}
                    type="number" placeholder="0"
                    value={form.stock}
                    onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                  />
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 8 }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                  placeholder="Product description..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>

            </div>

            {/* Footer */}
            <div style={{
              padding: "16px 24px", background: "#f8fafc",
              display: "flex", gap: 10, justifyContent: "flex-end",
              borderTop: "1px solid #e5e7eb",
            }}>
              <button
                onClick={closeModal}
                style={{
                  padding: "10px 20px", borderRadius: 8,
                  fontWeight: 600, fontSize: 14, cursor: "pointer",
                  background: "white", border: "1px solid #d1d5db", color: "#374151",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: "10px 20px", borderRadius: 8,
                  fontWeight: 600, fontSize: 14, cursor: "pointer",
                  background: "#3b72e9", color: "white", border: "none",
                }}
              >
                {modal === "add" ? "Add Product" : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {modal === "delete" && (
        <div
          className="modal-overlay open"
          onClick={e => { if (e.target.className.includes("modal-overlay")) closeModal(); }}
        >
          <div style={{
            background: "white", width: "90%", maxWidth: 400,
            borderRadius: 12, padding: 24,
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
              Delete Product
            </div>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 6 }}>
              Are you sure you want to delete <strong>{selected?.name}</strong>?
            </p>
            <p style={{ fontSize: 13, color: "#ef4444", fontWeight: 500, marginBottom: 20 }}>
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                onClick={closeModal}
                style={{
                  padding: "10px 20px", borderRadius: 8,
                  fontWeight: 600, fontSize: 14, cursor: "pointer",
                  background: "white", border: "1px solid #d1d5db", color: "#374151",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: "10px 20px", borderRadius: 8,
                  fontWeight: 600, fontSize: 14, cursor: "pointer",
                  background: "#ef4444", color: "white", border: "none",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}