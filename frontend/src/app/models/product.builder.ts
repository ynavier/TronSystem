
import { Product } from './product';

export class ProductBuilder {
  private product: Product = {
    nombre:      '',
    descripcion: '',
    precio:      0,
    cantidad:    0,
    categoria:   '',
  };

  setId(id: string): ProductBuilder {
    this.product._id = id;
    return this;
  }

  setNombre(nombre: string): ProductBuilder {
    this.product.nombre = nombre;
    return this;
  }

  setDescripcion(descripcion: string): ProductBuilder {
    this.product.descripcion = descripcion;
    return this;
  }

  setPrecio(precio: number): ProductBuilder {
    this.product.precio = precio;
    return this;
  }

  setCantidad(cantidad: number): ProductBuilder {
    this.product.cantidad = cantidad;
    return this;
  }

  setCategoria(categoria: string): ProductBuilder {
    this.product.categoria = categoria;
    return this;
  }

  build(): Product {
    if (!this.product.nombre)     throw new Error('El nombre es obligatorio');
    if (!this.product.categoria)  throw new Error('La categoría es obligatoria');
    if (this.product.precio <= 0) throw new Error('El precio debe ser mayor a 0');
    if (this.product.cantidad < 0) throw new Error('La cantidad no puede ser negativa');

    return { ...this.product };
  }
}