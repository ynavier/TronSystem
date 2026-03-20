import { Request, Response } from 'express';
import { Product } from '../models/product.model';

// GET /api/products
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos', err });
  }
};

// GET /api/products/:id
export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) { res.status(404).json({ message: 'Producto no encontrado' }); return; }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error', err });
  }
};

// POST /api/products
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear producto', err });
  }
};

// PUT /api/products/:id
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) { res.status(404).json({ message: 'Producto no encontrado' }); return; }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar', err });
  }
};

// DELETE /api/products/:id
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) { res.status(404).json({ message: 'Producto no encontrado' }); return; }
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar', err });
  }
};