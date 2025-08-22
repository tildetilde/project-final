import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
export declare const errorHandler: (err: Error | AppError, req: Request, res: Response, next: NextFunction) => void;
export declare const notFound: (req: Request, res: Response) => void;
//# sourceMappingURL=errorHandler.d.ts.map