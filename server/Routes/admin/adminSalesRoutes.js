import express from "express";
import {
  getSalesOverview,
  getDailyRevenue,
  getTopProducts,
} from "../../Controller/admin/adminSalesController.js";
import { verifyToken, verifyAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);
router.use(verifyAdmin);

router.get("/overview",  getSalesOverview);
router.get("/daily",     getDailyRevenue);
router.get("/top",       getTopProducts);

export default router;