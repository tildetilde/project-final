import { Document } from 'mongoose';
export interface IItem extends Document {
    name: string;
    value: number;
    label: string;
    categoryId: string;
}
export declare const Item: import("mongoose").Model<IItem, {}, {}, {}, Document<unknown, {}, IItem, {}, {}> & IItem & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Item.d.ts.map