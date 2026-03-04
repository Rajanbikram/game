import express from "express";
import { createPayment } from "../../Controller/user/paymentController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createPayment);

export default router;