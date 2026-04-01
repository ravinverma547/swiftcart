"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const authValidation_1 = require("../validations/authValidation");
const router = express_1.default.Router();
router.post('/register', (0, validate_1.validate)(authValidation_1.registerSchema), authController_1.register);
router.post('/login', (0, validate_1.validate)(authValidation_1.loginSchema), authController_1.login);
router.get('/logout', authController_1.logout);
router.get('/me', auth_1.isAuthenticated, authController_1.getMe);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map