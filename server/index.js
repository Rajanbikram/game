import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connection } from "./database/db.js";

// Routes
import authRoutes from "./Routes/auth/authRoutes.js";
import productRoutes from "./Routes/user/productRoutes.js";
import cartRoutes from "./Routes/user/CartRoutes.js";
import orderRoutes from "./Routes/user/orderRoutes.js";
import paymentRoutes from "./Routes/user/paymentRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// Start server
connection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});