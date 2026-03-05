import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";

const ITEMS_PER_PAGE = 8;
const statuses = ["Processing", "Shipped", "Delivered"];

export default function ManageOrders({ showToast }) {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [confirm, setConfirm] = useState(null); // { orderId, status }

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/admin/orders");
      setOrders(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filtered = orders.filter(o =>
    o.id?.toLowerCase().includes(search.toLowerCase()) ||
    `${o.User?.firstName} ${o.User?.lastName}`.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleStatusChange = (orderId, status) => {
    setConfirm({ orderId, status });
  };

  const confirmStatus = async () => {
    try {
      await axiosInstance.put(`/admin/orders/${confirm.orderId}`, { status: confirm.status });
      showToast(`Order status updated to ${confirm.status}`, "success");
      setConfirm(null);
      fetchOrders();
    } catch (err) {
      showToast("Error updating status.", "error");
    }
  };

  return (
    <div className="space-y">
      <h1 className="page-title">Manage Orders</h1>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 280 }}>
        <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "var(--muted)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input
          style={{ width: "100%", paddingLeft: 32, height: 34, border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, outline: "none", background: "var(--muted-bg)" }}
          placeholder="Search orders..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <div className="card">
        <div className="card-content" style={{ paddingTop: 0 }}>
          {loading ? (
            <div className="loading"><div className="spinner"></div>Loading...</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(o => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 500 }}>{o.id?.slice(0, 8)}...</td>
                      <td>
                        <div>{o.User?.firstName} {o.User?.lastName}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>{o.User?.email}</div>
                      </td>
                      <td style={{ color: "var(--muted)" }}>
                        {o.OrderItems?.map(i => i.Product?.name).join(", ") || "—"}
                      </td>
                      <td style={{ fontWeight: 500 }}>${o.total?.toFixed(2)}</td>
                      <td style={{ color: "var(--muted)" }}>{o.createdAt?.split("T")[0]}</td>
                      <td>
                        <select
                          value={o.status}
                          onChange={e => handleStatusChange(o.id, e.target.value)}
                        >
                          {statuses.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`page-btn ${page === i + 1 ? "active" : ""}`} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Status Modal */}
      {confirm && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-title">Update Order Status</div>
            <p className="confirm-msg">Change status to <strong>{confirm.status}</strong>?</p>
            <p className="confirm-warn">This will notify the customer.</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => { setConfirm(null); fetchOrders(); }}>Cancel</button>
              <button className="btn btn-primary" onClick={confirmStatus}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}