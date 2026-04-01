import type { Request, Response } from "express";
export declare const checkoutOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const listMyOrders: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getOrderById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const adminListOrders: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const adminUpdateOrderStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=order.controller.d.ts.map