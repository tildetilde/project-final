import { Schema, model, Document } from 'mongoose';

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

export const Category = model<ICategory>('Category', CategorySchema);