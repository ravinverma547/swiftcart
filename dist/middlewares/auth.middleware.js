"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const requireAuth = (req, res, next) => {
    try {
        if (!JWT_SECRET) {
            return res.status(500).json({ success: false, message: "JWT_SECRET missing in env" });
        }
        const secret = JWT_SECRET;
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Missing or invalid Authorization header" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Missing token in Authorization header" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.userId) || !(decoded === null || decoded === void 0 ? void 0 : decoded.role) || !(decoded === null || decoded === void 0 ? void 0 : decoded.email)) {
            return res.status(401).json({ success: false, message: "Unauthorized: invalid token payload" });
        }
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
            email: decoded.email,
        };
        next();
    }
    catch (err) {
        return res.status(401).json({ success: false, message: "Unauthorized: invalid token" });
    }
};
exports.requireAuth = requireAuth;
const requireAdmin = (req, res, next) => {
    (0, exports.requireAuth)(req, res, () => {
        const user = req.user;
        if (!user || user.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Admin access required" });
        }
        next();
    });
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=auth.middleware.js.map