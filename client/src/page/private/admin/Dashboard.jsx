import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";

export default function Dashboard() {
  const [stats, setStats]       = useState(null);
  const [orders, setOrders]     = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [salesRes, ordersRes, productsRes] = await Promise.all([
        axiosInstance.get("/admin/sales/overview"),
        axiosInstance.get("/admin/orders"),
        axiosInstance.get("/admin/products"),
      ]);
      setStats(salesRes.data);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="loading"><div className="spinner"></div>Loading...</div>
  );

  const statCards = [
    { title: "Total Products",   value: products.length,                       icon: "📦", cls: "blue"   },
    { title: "Total Orders",     value: stats?.totalOrders || 0,               icon: "🛒", cls: "green"  },
    { title: "Total Revenue",    value: `$${stats?.totalRevenue?.toFixed(2) || "0.00"}`, icon: "💰", cls: "yellow" },
    { title: "Avg Order Value",  value: `$${stats?.avgOrderValue?.toFixed(2) || "0.00"}`, icon: "📈", cls: "red"   },
  ];

  const lowStock = [...products].sort((a, b) => a.stock - b.stock).slice(0, 4);

  return (
    <div className="space-y">
      <h1 className="page-title">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-4">
        {statCards.map((s) => (
          <div className="card" key={s.title}>
            <div className="card-header">
              <div className="stat-header">
                <span className="card-title sm">{s.title}</span>
                <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
              </div>
            </div>
            <div className="card-content">
              <div className="stat-value">{s.value}</div>
              <div className="stat-change">Updated just now</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-2">
        {/* Recent Orders */}
        <div className="card">
          <div className="card-header"><div className="card-title">Recent Orders</div></div>
          <div className="card-content">
            {orders.slice(0, 4).map((o) => (
              <div className="list-row" key={o.id}>
                <div>
                  <div className="name">{o.User?.firstName} {o.User?.lastName}</div>
                  <div className="sub">{o.id?.slice(0, 8)}... · {o.createdAt?.split("T")[0]}</div>
                </div>
                <div className="right">
                  <div className="name">${o.total?.toFixed(2)}</div>
                  <span className={`badge badge-${o.status}`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="card">
          <div className="card-header"><div className="card-title">Low Stock Products</div></div>
          <div className="card-content">
            {lowStock.map((p) => (
              <div className="list-row" key={p.id}>
                <div>
                  <div className="name">{p.name}</div>
                  <div className="sub">{p.category}</div>
                </div>
                <span className={p.stock < 20 ? "stock-low" : "sub"} style={{ fontSize: "12px", fontWeight: 500 }}>
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}