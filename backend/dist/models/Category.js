import { Schema, model } from 'mongoose';
const CategorySchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    question: { type: String, required: false },
    unit: { type: String, required: true },
    unitVisible: { type: Boolean, required: false },
    sort: { type: String, enum: ['asc', 'desc'], required: false },
    source: {
        name: { type: String, required: false },
        url: { type: String, required: false }
    },
    version: { type: Number, required: false }
}, { strict: false, timestamps: false });
export const Category = model('Category', CategorySchema);
//# sourceMappingURL=Category.js.map