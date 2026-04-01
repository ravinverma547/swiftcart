import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { addCartItem, clearCart, getCart, removeCartItem, updateCartItem } from "./cart.controller";

const router = Router();

router.get("/", requireAuth, getCart);
router.post("/items", requireAuth, addCartItem);
router.patch("/items/:productId", requireAuth, updateCartItem);
router.delete("/items/:productId", requireAuth, removeCartItem);
router.post("/clear", requireAuth, clearCart);

export default router;

