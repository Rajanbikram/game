import express from "express";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../Controller/admin/adminProductController.js";
import { verifyToken, verifyAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);
router.use(verifyAdmin);

router.get("/",          getAllProducts);
router.post("/",         addProduct);
router.put("/:id",       updateProduct);
router.delete("/:id",    deleteProduct);

export default router;