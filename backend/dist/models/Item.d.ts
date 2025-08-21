import { Document } from 'mongoose';
import { QuizItem } from '../types/quiz.js';
export interface IItem extends Document, Omit<QuizItem, '_id' | 'id'> {
}
export declare const Item: import("mongoose").Model<IItem, {}, {}, {}, Document<unknown, {}, IItem, {}, {}> & IItem & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Item.d.ts.map