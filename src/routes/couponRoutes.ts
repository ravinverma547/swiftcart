import express from 'express';
import { validateCoupon, getMyCoupons } from '../controllers/couponController';
import { isAuthenticated } from '../middlewares/auth';

const router = express.Router();

router.post('/validate', isAuthenticated, validateCoupon);
router.get('/my', isAuthenticated, getMyCoupons);

export default router;
