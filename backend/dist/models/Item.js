import { Schema, model } from 'mongoose';
const ItemSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    value: { type: Number, required: true },
    label: { type: String, required: true },
    categoryId: { type: String, required: true },
    source: {
        name: { type: String, required: true }
    }
});
export const Item = model('Item', ItemSchema);
//# sourceMappingURL=Item.js.map