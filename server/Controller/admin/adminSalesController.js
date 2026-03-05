import Order from "../../Model/user/Order.js";
import OrderItem from "../../Model/user/OrderItem.js";
import Product from "../../Model/user/Product.js";
import User from "../../Model/auth/User.js";
import { sequelize } from "../../database/db.js";
import { Op } from "sequelize";

// GET sales overview
export const getSalesOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const orders = await Order.findAll({ where });

    const totalRevenue   = orders.reduce((s, o) => s + o.total, 0);
    const totalOrders    = orders.length;
    const avgOrderValue  = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // today orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(o => new Date(o.createdAt) >= today).length;

    return res.status(200).json({
      totalRevenue:  parseFloat(totalRevenue.toFixed(2)),
      totalOrders,
      avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
      todayOrders,
    });
  } catch (error) {
    console.error("❌ getSalesOverview error:", error.message);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// GET daily revenue (bar chart)
export const getDailyRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const orders = await Order.findAll({ where });

    const daily = {};
    orders.forEach((o) => {
      const date = new Date(o.createdAt).toISOString().split("T")[0];
      daily[date] = (daily[date] || 0) + o.total;
    });

    const result = Object.entries(daily).map(([date, revenue]) => ({
      date,
      revenue: parseFloat(revenue.toFixed(2)),
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ getDailyRevenue error:", error.message);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// GET top selling products
export const getTopProducts = async (req, res) => {
  try {
    const topItems = await OrderItem.findAll({
      attributes: [
        "productId",
        [sequelize.fn("SUM", sequelize.col("quantity")), "totalSold"],
        [sequelize.fn("SUM", sequelize.literal('"OrderItem"."quantity" * "OrderItem"."price"')), "totalRevenue"],
      ],
      group: ["productId", "Product.id"],
      include: [{ model: Product, attributes: ["name", "image", "category"] }],
      order: [[sequelize.fn("SUM", sequelize.col("quantity")), "DESC"]],
      limit: 5,
    });

    return res.status(200).json(topItems);
  } catch (error) {
    console.error("❌ getTopProducts error:", error.message);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};