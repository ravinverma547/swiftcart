import { Router } from "express";
import { requireAuth, requireAdmin } from "../../middlewares/auth.middleware";
import {
  adminListOrders,
  adminUpdateOrderStatus,
  checkoutOrder,
  getOrderById,
  listMyOrders,
} from "./order.controller";

const router = Router();

router.post("/checkout", requireAuth, checkoutOrder);
router.get("/", requireAuth, listMyOrders);
router.get("/:id", requireAuth, getOrderById);

// Admin
router.get("/admin", requireAuth, requireAdmin, adminListOrders);
router.patch("/admin/:id/status", requireAuth, requireAdmin, adminUpdateOrderStatus);

export default router;

