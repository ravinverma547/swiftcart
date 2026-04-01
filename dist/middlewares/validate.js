"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        res.status(400).json({
            success: false,
            errors: error.errors.map((e) => ({
                path: e.path.join('.'),
                message: e.message,
            })),
        });
    }
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map