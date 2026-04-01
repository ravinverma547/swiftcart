import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";
export type AuthUser = {
    userId: string;
    role: Role;
    email: string;
};
export type AuthedRequest = Request & {
    user: AuthUser;
};
export declare const requireAuth: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map