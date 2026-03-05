import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard    from "./Dashboard";
import Products     from "./Products";
import ManageOrders from "./ManageOrders";
import SalesReport  from "./SalesReport";
import Profile      from "./Profile";
import "../../../css/admin.css";

const navItems = [
  { key: "dashboard", label: "Dashboard"    },
  { key: "products",  label: "Products"     },
  { key: "orders",    label: "Orders"       },
  { key: "sales",     label: "Sales Report" },
  { key: "profile",   label: "Profile"      },
];

const getIcon = (key) => {
  switch (key) {
    case "dashboard": return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    );
    case "products": return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4M4 7l8 4M4 7v10l8 4m0-10v10"/>
      </svg>
    );
    case "orders": return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
      </svg>
    );
    case "sales": return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M18 20V10M12 20V4M6 20v-6"/>
      </svg>
    );
    case "profile": return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    );
    default: return null;
  }
};

export default function AdminLayout() {
  const [activePage,  setActivePage]  = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toasts,      setToasts]      = useState([]);
  const navigate = useNavigate();

  const showToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "products":  return <Products  showToast={showToast} />;
      case "orders":    return <ManageOrders showToast={showToast} />;
      case "sales":     return <SalesReport />;
      case "profile":   return <Profile showToast={showToast} />;
      default:          return <Dashboard />;
    }
  };

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className={`sidebar ${!sidebarOpen ? "collapsed" : ""}`}>
        <div className="sidebar-logo">
          <span>🛍</span> NovaMart
        </div>

        <div className="sidebar-label">Menu</div>

        <ul className="sidebar-menu">
          {navItems.map(item => (
            <li key={item.key}>
              <a                                         
                href="#"
                className={activePage === item.key ? "active" : ""}
                onClick={e => { e.preventDefault(); setActivePage(item.key); }}
              >
                {getIcon(item.key)}
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <div style={{ marginTop: "auto", padding: "12px 8px" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              gap: 10, padding: "9px 12px", borderRadius: 8,
              border: "none", background: "transparent",
              color: "var(--muted)", fontSize: 14,
              fontWeight: 500, cursor: "pointer",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--destructive-light)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <svg
              width="18" height="18"
              xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className={`admin-main ${!sidebarOpen ? "expanded" : ""}`}>

        {/* TOPBAR */}
        <div className="topbar">
          <button
            className="topbar-toggle"
            onClick={() => setSidebarOpen(o => !o)}
          >
            <svg
              width="20" height="20"
              viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
            >
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>

          <span className="topbar-title">NovaMart Admin</span>

          <div className="topbar-search">
            <svg
              viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input placeholder="Search..." />
          </div>

          <div className="topbar-actions">
            <button className="topbar-icon-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth="2"
              >
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <span className="notif-dot"></span>
            </button>

            <button
              className="topbar-profile"
              onClick={() => setActivePage("profile")}
            >
              <div className="profile-avatar">
                {(user.firstName?.[0] || "A").toUpperCase()}
              </div>
              <span className="profile-name">
                {user.firstName || "Admin"}
              </span>
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="admin-content">
          <div className="admin-page active">
            {renderPage()}
          </div>
        </div>
      </div>

      {/* TOAST */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.msg}
          </div>
        ))}
      </div>

    </div>
  );
}