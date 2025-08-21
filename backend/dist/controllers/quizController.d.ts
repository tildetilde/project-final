import { Request, Response } from 'express';
export declare const getCategories: (req: Request, res: Response) => Promise<void>;
export declare const getCategoryItems: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getQuizItems: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const checkAnswers: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=quizController.d.ts.map