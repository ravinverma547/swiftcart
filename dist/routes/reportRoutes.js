"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reportController_1 = require("../controllers/reportController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post('/submit', auth_1.isAuthenticated, reportController_1.submitReport);
router.get('/admin/all', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('ADMIN'), reportController_1.getAllReports);
router.put('/admin/:id', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('ADMIN'), reportController_1.updateReportStatus);
exports.default = router;
//# sourceMappingURL=reportRoutes.js.map