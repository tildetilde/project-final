import { Document } from 'mongoose';
export interface ICategory extends Document {
    id: string;
    name: string;
    description?: string;
    question?: string;
    unit: string;
    unitVisible?: boolean;
    sort?: 'asc' | 'desc';
    source?: {
        name: string;
        url: string;
    };
    version?: number;
}
export declare const Category: import("mongoose").Model<ICategory, {}, {}, {}, Document<unknown, {}, ICategory, {}, {}> & ICategory & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Category.d.ts.map