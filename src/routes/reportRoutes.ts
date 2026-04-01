import express from 'express';
import { submitReport, getAllReports, updateReportStatus } from '../controllers/reportController';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth';

const router = express.Router();

router.post('/submit', isAuthenticated, submitReport);
router.get('/admin/all', isAuthenticated, authorizeRoles('ADMIN'), getAllReports);
router.put('/admin/:id', isAuthenticated, authorizeRoles('ADMIN'), updateReportStatus);

export default router;
