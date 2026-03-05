import express from "express";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../Controller/admin/adminOrderController.js";
import { verifyToken, verifyAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);
router.use(verifyAdmin);

router.get("/",          getAllOrders);
router.put("/:id",       updateOrderStatus);

export default router;