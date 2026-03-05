import Order from "../../Model/user/Order.js";
import OrderItem from "../../Model/user/OrderItem.js";
import Product from "../../Model/user/Product.js";
import User from "../../Model/auth/User.js";

// GET all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ["firstName", "lastName", "email"] },
        { model: OrderItem, include: [{ model: Product, attributes: ["name", "price", "image"] }] },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json(orders);
  } catch (error) {
    console.error("❌ getAllOrders error:", error.message);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// UPDATE order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    const validStatuses = ["Processing", "Shipped", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    await order.update({ status });
    console.log("✅ Order status updated:", order.id, status);
    return res.status(200).json({ message: "Order status updated!", order });
  } catch (error) {
    console.error("❌ updateOrderStatus error:", error.message);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};