import Payment from "../../Model/user/Payment.js";
import Order from "../../Model/user/Order.js";

// CREATE payment
export const createPayment = async (req, res) => {
  try {
    const { orderId, method } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });

    const payment = await Payment.create({
      orderId,
      method,
      amount: order.total,
      status: "completed",
    });

    return res.status(201).json({ message: "Payment successful!", payment });
  } catch (error) {
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};