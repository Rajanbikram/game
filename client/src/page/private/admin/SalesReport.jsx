import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../utils/axiosInstance";

export default function SalesReport() {
  const [overview, setOverview]     = useState(null);
  const [daily, setDaily]           = useState([]);
  const [topProducts, setTop]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [startDate, setStartDate]   = useState("");
  const [endDate, setEndDate]       = useState("");
  const canvasRef = useRef(null);

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    if (daily.length > 0) drawPie();
  }, [daily]);

  const fetchAll = async (start = "", end = "") => {
    try {
      setLoading(true);
      const params = {};
      if (start && end) { params.startDate = start; params.endDate = end; }
      const [overviewRes, dailyRes, topRes] = await Promise.all([
        axiosInstance.get("/admin/sales/overview", { params }),
        axiosInstance.get("/admin/sales/daily",    { params }),
        axiosInstance.get("/admin/sales/top"),
      ]);
      setOverview(overviewRes.data);
      setDaily(dailyRes.data);
      setTop(topRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleFilter = () => { fetchAll(startDate, endDate); };

  const drawPie = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = 90, cy = 90, r = 70, ir = 42;
    const colors = { Processing: "#f59e0b", Shipped: "#3b72e9", Delivered: "#22c55e" };
    const statusCount = {};
    // use overview data for pie
    ctx.clearRect(0, 0, 180, 180);
    // simple placeholder if no data
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.arc(cx, cy, ir, 2 * Math.PI, 0, true);
    ctx.fillStyle = "#e5e7eb";
    ctx.fill();
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  const maxRev = Math.max(...daily.map(d => d.revenue), 1);

  return (
    <div className="space-y">
      <h1 className="page-title">Sales Report</h1>

      {/* Date Filter */}
      <div className="date-filter">
        <span style={{ fontSize: 13, color: "var(--muted)" }}>From</span>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <span style={{ fontSize: 13, color: "var(--muted)" }}>To</span>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <button className="btn btn-primary" onClick={handleFilter}>Apply</button>
        <button className="btn btn-outline" onClick={() => { setStartDate(""); setEndDate(""); fetchAll(); }}>Reset</button>
      </div>

      {/* Stats */}
      <div className="grid grid-3">
        {[
          { title: "Total Revenue",   value: `$${overview?.totalRevenue?.toFixed(2) || "0.00"}` },
          { title: "Total Orders",    value: overview?.totalOrders || 0 },
          { title: "Avg Order Value", value: `$${overview?.avgOrderValue?.toFixed(2) || "0.00"}` },
          { title: "Orders Today",    value: overview?.todayOrders || 0 },
        ].map(s => (
          <div className="card" key={s.title}>
            <div className="card-header"><div className="card-title sm">{s.title}</div></div>
            <div className="card-content"><div className="stat-value">{s.value}</div></div>
          </div>
        ))}
      </div>

      <div className="grid grid-2">
        {/* Bar Chart */}
        <div className="card">
          <div className="card-header"><div className="card-title">Daily Revenue</div></div>
          <div className="card-content">
            {daily.length === 0 ? (
              <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, padding: "2rem 0" }}>No data available</div>
            ) : (
              <div className="bar-chart">
                {daily.map(d => (
                  <div className="bar-col" key={d.date}>
                    <div className="bar-value">${(d.revenue / 1000).toFixed(1)}k</div>
                    <div className="bar" style={{ height: `${Math.max((d.revenue / maxRev) * 160, 8)}px` }}></div>
                    <div className="bar-label">{d.date.slice(5)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <div className="card-header"><div className="card-title">Top Selling Products</div></div>
          <div className="card-content">
            {topProducts.length === 0 ? (
              <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, padding: "2rem 0" }}>No data available</div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Sold</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((item, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500 }}>{item.Product?.name}</td>
                        <td style={{ color: "var(--muted)" }}>{item.Product?.category}</td>
                        <td>{item.totalSold}</td>
                        <td style={{ fontWeight: 500 }}>${parseFloat(item.totalRevenue).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}