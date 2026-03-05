import Product from "../../Model/user/Product.js";

// GET all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (error) {
    console.error("❌ getAllProducts error:", error.message);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// ADD product
export const addProduct = async (req, res) => {
  try {
    const { name, category, price, stock, description, image } = req.body;

    console.log("📥 Add product:", req.body);

    if (!name || !category || !price || !description) {
      return res.status(400).json({ message: "Name, category, price and description are required." });
    }

    const product = await Product.create({
      name,
      brand: "N/A",
      category,
      price: parseFloat(price),
      originalPrice: null,
      description,
      specifications: {},
      image: image || "",
      rating: 0,
      reviews: 0,
      inStock: stock > 0 ? true : false,
      stock: parseInt(stock) || 0,
    });

    console.log("✅ Product added:", product.name);
    return res.status(201).json({ message: "Product added!", product });
  } catch (error) {
    console.error("❌ addProduct error:", error.message);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// UPDATE product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });

    const { name, category, price, stock, description, image } = req.body;

    await product.update({
      name:        name        ?? product.name,
      category:    category    ?? product.category,
      price:       price       ? parseFloat(price) : product.price,
      description: description ?? product.description,
      image:       image       ?? product.image,
      stock:       stock       !== undefined ? parseInt(stock) : product.stock,
      inStock:     stock       !== undefined ? stock > 0 : product.inStock,
    });

    console.log("✅ Product updated:", product.name);
    return res.status(200).json({ message: "Product updated!", product });
  } catch (error) {
    console.error("❌ updateProduct error:", error.message);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });

    await product.destroy();
    console.log("✅ Product deleted:", req.params.id);
    return res.status(200).json({ message: "Product deleted!" });
  } catch (error) {
    console.error("❌ deleteProduct error:", error.message);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};