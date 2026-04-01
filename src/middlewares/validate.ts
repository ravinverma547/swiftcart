import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';

export const validate = (schema: ZodObject<any, any, any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error: any) {
    res.status(400).json({
      success: false,
      errors: error.errors.map((e: any) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }
};
