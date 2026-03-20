import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  categoria: string;
  createdAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    nombre:      { type: String, required: true, trim: true },
    descripcion: { type: String, default: '' },
    precio:      { type: Number, required: true, min: 0 },
    cantidad:    { type: Number, required: true, min: 0 },
    categoria:   { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', ProductSchema);