"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.createUser = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "";
const signToken = (payload) => {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET missing in env");
    }
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};
const createUser = async ({ name, email, password }) => {
    const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("User already exists with this email");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    // Role is default CUSTOMER in schema.
    return prisma_1.default.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });
};
exports.createUser = createUser;
const login = async ({ email, password }) => {
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("Invalid email or password");
    }
    const ok = await bcryptjs_1.default.compare(password, user.password);
    if (!ok) {
        throw new Error("Invalid email or password");
    }
    const token = signToken({ userId: user.id, role: user.role, email: user.email });
    const { password: _password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword, role: user.role };
};
exports.login = login;
//# sourceMappingURL=auth.service.js.map