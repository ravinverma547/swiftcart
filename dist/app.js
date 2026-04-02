"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
const error_1 = require("./middlewares/error");
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
const frontendUrl = process.env.FRONTEND_URL;
const formattedFrontendUrl = frontendUrl && !frontendUrl.startsWith('http')
    ? `https://${frontendUrl}`
    : frontendUrl;
const allowedOrigins = [
    'http://localhost:5173',
    formattedFrontendUrl,
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
// Routes
app.use('/api/v1', routes_1.default);
// Error Handling Middleware
app.use(error_1.errorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map