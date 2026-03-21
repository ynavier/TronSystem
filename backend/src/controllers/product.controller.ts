import { Request, Response } from 'express';
import { Product } from '../models/product.model';
import { ProductBuilder } from '../builders/product.builder';

// GET /api/products
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error al obtener productos', err });
  }
};

// GET /api/products/:id
export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, msg: 'Producto no encontrado' });
      return;
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error al obtener producto', err });
  }
};

// POST /api/products
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = new ProductBuilder()
      .setNombre(req.body.nombre)
      .setDescripcion(req.body.descripcion)
      .setPrecio(req.body.precio)
      .setCantidad(req.body.cantidad)
      .setCategoria(req.body.categoria)
      .build();

    const product = new Product(data);
    const saved = await product.save();

    res.status(201).json({ success: true, saved });
  } catch (e: any) {
    if (e?.code === 11000) {
      res.status(400).json({ success: false, msg: 'El producto ya existe' });
      return;
    }
    res.status(400).json({ success: false, msg: e.message || 'Error al crear producto' });
  }
};

// PUT /api/products/:id
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = new ProductBuilder()
      .setNombre(req.body.nombre)
      .setDescripcion(req.body.descripcion)
      .setPrecio(req.body.precio)
      .setCantidad(req.body.cantidad)
      .setCategoria(req.body.categoria)
      .build();

    const updated = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      res.status(404).json({ success: false, msg: 'Producto no encontrado' });
      return;
    }

    res.status(200).json({ success: true, updated });
  } catch (e: any) {
    if (e?.code === 11000) {
      res.status(400).json({ success: false, msg: 'El producto ya existe' });
      return;
    }
    res.status(400).json({ success: false, msg: e.message || 'Error al actualizar' });
  }
};

// DELETE /api/products/:id
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, msg: 'Producto no encontrado' });
      return;
    }
    res.json({ success: true, msg: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error al eliminar', err });
  }
};