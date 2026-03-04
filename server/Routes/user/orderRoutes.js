import express from "express";
import { getOrders, placeOrder } from "../../Controller/user/orderController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getOrders);
router.post("/place", placeOrder);

export default router;