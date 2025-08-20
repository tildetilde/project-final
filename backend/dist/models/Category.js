import { Schema, model } from 'mongoose';
const CategorySchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    unit: { type: String, required: true },
});
export const Category = model('Category', CategorySchema);
//# sourceMappingURL=Category.js.map