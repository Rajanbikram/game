import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connection } from "./database/db.js";

// User routes
import authRoutes    from "./Routes/auth/authRoutes.js";
import productRoutes from "./Routes/user/productRoutes.js";
import cartRoutes    from "./Routes/user/cartRoutes.js";
import orderRoutes   from "./Routes/user/orderRoutes.js";
import paymentRoutes from "./Routes/user/paymentRoutes.js";

// Admin routes
import adminProductRoutes from "./Routes/admin/adminProductRoutes.js";
import adminOrderRoutes   from "./Routes/admin/adminOrderRoutes.js";
import adminSalesRoutes   from "./Routes/admin/adminSalesRoutes.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));        // ← 10mb limit
app.use(express.urlencoded({ limit: "10mb", extended: true })); // ← url encoded ni

// User API
app.use("/api/auth",     authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/payment",  paymentRoutes);

// Admin API
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders",   adminOrderRoutes);
app.use("/api/admin/sales",    adminSalesRoutes);

connection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});