import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

export const submitReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, message } = req.body;
    const userId = (req as any).user.id;
    const userName = (req as any).user.name;

    const report = await prisma.report.create({
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
  } catch (error) {
    next(error);
  }
};

export const getAllReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } }
      }
    });

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReportStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, adminResponse } = req.body;
    const { id } = req.params;

    const report = await prisma.report.update({
      where: { id },
      data: { status, adminResponse },
    });

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};
