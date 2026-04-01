import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { createReview, listReviews } from "./review.controller";

const router = Router();

router.get("/", listReviews); // optional ?productId=
router.post("/", requireAuth, createReview);

export default router;

