import express from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import orderRoutes from './orderRoutes';
import reportRoutes from './reportRoutes';
import couponRoutes from './couponRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/reports', reportRoutes);
router.use('/coupons', couponRoutes);

export default router;
