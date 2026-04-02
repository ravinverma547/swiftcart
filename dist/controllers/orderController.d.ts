import { Request, Response, NextFunction } from 'express';
export declare const createOrder: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getOrderDetails: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyOrders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllOrders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateOrder: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const returnOrder: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const cancelOrder: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=orderController.d.ts.map