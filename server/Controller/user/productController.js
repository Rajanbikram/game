import Product from "../../Model/user/Product.js";
import { Op } from "sequelize";

// GET all products with filter
export const getProducts = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, search } = req.query;

    const where = {};

    if (category && category !== "All") {
      where.category = category;
    }
    if (brand) {
      where.brand = { [Op.in]: brand.split(",") };
    }
    if (minPrice || maxPrice) {
      where.price = {
        [Op.gte]: parseFloat(minPrice) || 0,
        [Op.lte]: parseFloat(maxPrice) || 99999,
      };
    }
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    const products = await Product.findAll({ where });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// GET single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};