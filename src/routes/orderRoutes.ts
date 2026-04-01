import express from 'express';
import { 
  createOrder, 
  getOrderDetails, 
  getMyOrders, 
  getAllOrders, 
  updateOrder,
  returnOrder,
  cancelOrder
} from '../controllers/orderController';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth';

const router = express.Router();

// Protected Routes
router.post('/new', isAuthenticated, createOrder);
router.get('/me', isAuthenticated, getMyOrders);
router.get('/:id', isAuthenticated, getOrderDetails);
router.put('/return/:id', isAuthenticated, returnOrder);
router.put('/cancel/:id', isAuthenticated, cancelOrder);

// Admin Routes
router.get('/admin/all', isAuthenticated, authorizeRoles('ADMIN'), getAllOrders);
router.put('/admin/:id', isAuthenticated, authorizeRoles('ADMIN'), updateOrder);

export default router;
