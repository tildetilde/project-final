import { Schema, model } from 'mongoose';
const ItemSchema = new Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true },
    label: { type: String, required: true },
    categoryId: { type: String, required: true },
});
export const Item = model('Item', ItemSchema);
//# sourceMappingURL=Item.js.map