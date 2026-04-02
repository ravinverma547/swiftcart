"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReportStatus = exports.getAllReports = exports.submitReport = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const submitReport = async (req, res, next) => {
    try {
        const { type, message } = req.body;
        const userId = req.user.id;
        const userName = req.user.name;
        const report = await prisma_1.default.report.create({
            data: {
                userId,
                userName,
                type,
                message,
                status: 'PENDING'
            },
        });
        res.status(201).json({
            success: true,
            message: 'We understand your issue. A new product will be provided, or it will be returned/fixed soon.',
            report,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.submitReport = submitReport;
const getAllReports = async (req, res, next) => {
    try {
        const reports = await prisma_1.default.report.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } }
            }
        });
        res.status(200).json({
            success: true,
            reports,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllReports = getAllReports;
const updateReportStatus = async (req, res, next) => {
    try {
        const { status, adminResponse } = req.body;
        const { id } = req.params;
        const report = await prisma_1.default.report.update({
            where: { id },
            data: { status, adminResponse },
        });
        res.status(200).json({
            success: true,
            report,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateReportStatus = updateReportStatus;
//# sourceMappingURL=reportController.js.map