import express from 'express';
import { register, login, logout, getMe, joinPrime, getAllUsers } from '../controllers/authController';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../validations/authValidation';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/logout', logout);
router.get('/me', isAuthenticated, getMe);
router.put('/prime', isAuthenticated, joinPrime);
router.get('/admin/users', isAuthenticated, authorizeRoles('ADMIN'), getAllUsers);

export default router;
