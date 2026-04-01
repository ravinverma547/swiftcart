import { Router } from "express";
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminUpdateProduct,
  getProductById,
  getProducts,
} from "./product.controller";
import { requireAdmin, requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin
router.post("/", requireAuth, requireAdmin, adminCreateProduct);
router.patch("/:id", requireAuth, requireAdmin, adminUpdateProduct);
router.delete("/:id", requireAuth, requireAdmin, adminDeleteProduct);

export default router;

