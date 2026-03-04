import Order from "../../Model/user/Order.js";
import OrderItem from "../../Model/user/OrderItem.js";
import Cart from "../../Model/user/Cart.js";
import CartItem from "../../Model/user/CartItem.js";
import Product from "../../Model/user/Product.js";

// GET all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, include: [Product] }],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// PLACE order
export const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{ model: CartItem, include: [Product] }],
    });

    if (!cart || cart.CartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const total = cart.CartItems.reduce(
      (sum, item) => sum + item.Product.price * item.quantity, 0
    );

    const order = await Order.create({
      userId: req.user.id,
      total,
      status: "Processing",
    });

    for (const item of cart.CartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.Product.price,
      });
    }

    // clear cart
    await CartItem.destroy({ where: { cartId: cart.id } });

    return res.status(201).json({ message: "Order placed!", orderId: order.id });
  } catch (error) {
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};