import { Schema, model, Document } from 'mongoose';

export interface IItem extends Document {
  name: string;
  value: number;
  label: string;
  categoryId: string;
}

const ItemSchema = new Schema<IItem>({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  label: { type: String, required: true },
  categoryId: { type: String, required: true },
});

export const Item = model<IItem>('Item', ItemSchema);