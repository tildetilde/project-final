import { Request, Response, NextFunction } from 'express';
import { IAdmin } from '../models/Admin.js';
declare module 'express' {
    interface Request {
        admin?: IAdmin;
    }
}
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
//# sourceMappingURL=auth.d.ts.map