import { Router } from "express";
import {
  createProduct,
  deleteProductById,
  getAllProducts,
} from "../controllers/product.controller";
import { getProductById } from "../controllers/product.controller";
import { protect, restrictTo } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getAllProducts);
router.post("/", protect, createProduct);
router.get("/:id", getProductById);
router.delete("/:id", protect, restrictTo("admin"), deleteProductById);
// router.patch("/:id", protect, restrictTo("admin"), updateProductById);
export default router;
