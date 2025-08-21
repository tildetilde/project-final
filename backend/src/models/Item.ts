import { Schema, model, Document } from 'mongoose';
import { QuizItem } from '../types/quiz.js';

export interface IItem extends Document, Omit<QuizItem, '_id' | 'id'> {}

const ItemSchema = new Schema<IItem>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  value: { type: Number, required: true },
  label: { type: String, required: true },
  categoryId: { type: String, required: true },
  source: {
    name: { type: String, required: false }
  }
});

export const Item = model<IItem>('Item', ItemSchema);