import Cart from "../../Model/user/Cart.js";
import CartItem from "../../Model/user/CartItem.js";
import Product from "../../Model/user/Product.js";

// GET cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{ model: CartItem, include: [Product] }],
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
      cart.CartItems = [];
    }

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// ADD to cart
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findByPk(productId);
    if (!product || !product.inStock) {
      return res.status(400).json({ message: "Product not available." });
    }

    let cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) cart = await Cart.create({ userId: req.user.id });

    const existing = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
    } else {
      await CartItem.create({ cartId: cart.id, productId, quantity: 1 });
    }

    return res.status(200).json({ message: "Added to cart." });
  } catch (error) {
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// UPDATE quantity
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await CartItem.findByPk(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Item not found." });

    if (quantity < 1) {
      await item.destroy();
      return res.status(200).json({ message: "Item removed." });
    }

    item.quantity = quantity;
    await item.save();
    return res.status(200).json({ message: "Quantity updated." });
  } catch (error) {
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// REMOVE from cart
export const removeFromCart = async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Item not found." });
    await item.destroy();
    return res.status(200).json({ message: "Item removed." });
  } catch (error) {
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};