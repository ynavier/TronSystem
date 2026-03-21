import { IProduct } from '../models/product.model';

export class ProductBuilder {
  private data: Partial<IProduct> = {};

  setNombre(nombre: string): ProductBuilder {
    this.data.nombre = nombre;
    return this;
  }

  setDescripcion(descripcion: string): ProductBuilder {
    this.data.descripcion = descripcion;
    return this;
  }

  setPrecio(precio: number): ProductBuilder {
    this.data.precio = precio;
    return this;
  }

  setCantidad(cantidad: number): ProductBuilder {
    this.data.cantidad = cantidad;
    return this;
  }

  setCategoria(categoria: string): ProductBuilder {
    this.data.categoria = categoria;
    return this;
  }

  build(): Partial<IProduct> {
    if (!this.data.nombre)       throw new Error('El nombre es obligatorio');
    if (!this.data.categoria)    throw new Error('La categoría es obligatoria');
    if (this.data.precio! <= 0)  throw new Error('El precio debe ser mayor a 0');
    if (this.data.cantidad! < 0) throw new Error('La cantidad no puede ser negativa');

    return { ...this.data };
  }
}
