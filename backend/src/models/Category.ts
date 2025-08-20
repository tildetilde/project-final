import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  id: string;
  name: string;
  description: string;
  unit: string;
}

const CategorySchema = new Schema<ICategory>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  unit: { type: String, required: true },
});

export const Category = model<ICategory>('Category', CategorySchema);