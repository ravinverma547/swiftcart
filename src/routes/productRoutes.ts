import express from 'express';
import { 
  getProducts, 
  getProductDetails, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  createReview 
} from '../controllers/productController';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth';

const router = express.Router();

// Public Routes
router.get('/', getProducts);
router.get('/:id', getProductDetails);

// Protected Routes
router.post('/:productId/review', isAuthenticated, createReview);

// Admin Routes
router.post('/admin/new', isAuthenticated, authorizeRoles('ADMIN'), createProduct);
router.put('/admin/:id', isAuthenticated, authorizeRoles('ADMIN'), updateProduct);
router.delete('/admin/:id', isAuthenticated, authorizeRoles('ADMIN'), deleteProduct);

export default router;
