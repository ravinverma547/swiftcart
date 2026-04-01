"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';
    // Specific Error Handling
    if (err.name === 'JsonWebTokenError') {
        err.message = 'Invalid token. Please log in again';
        err.statusCode = 401;
    }
    if (err.name === 'TokenExpiredError') {
        err.message = 'Token has expired. Please log in again';
        err.statusCode = 401;
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.js.map