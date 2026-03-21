import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filtered: Product[] = [];
  loading = true;

  searchTerm = '';
  filterCategoria = '';
  filterPrecioMin: number | null = null;
  filterPrecioMax: number | null = null;

  showModal = false;
  showDeleteModal = false;
  isEdit = false;

  currentProduct: Product = this.emptyProduct();
  productToDelete: Product | null = null;

  productToView: Product | null = null;
  showViewModal = false;

  openView(p: Product): void {
    this.productToView = p;
    this.showViewModal = true;
    this.cdr.detectChanges();
  }

  closeView(): void {
    this.showViewModal = false;
    this.productToView = null;
    this.cdr.detectChanges();
  }

  toast: { msg: string; type: 'success' | 'error' } | null = null;
  toastTimer: any;

  categories = ['Laptops', 'Componentes', 'Periféricos', 'Almacenamiento', 'Smartphones', 'Otros'];

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void { this.loadProducts(); }

  emptyProduct(): Product {
    return { nombre: '', descripcion: '', precio: 0, cantidad: 0, categoria: 'Laptops' };
  }

  loadProducts(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToast('Error al conectar con el servidor', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    let result = [...this.products];
    if (this.searchTerm)
      result = result.filter(p => p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()));
    if (this.filterCategoria)
      result = result.filter(p => p.categoria === this.filterCategoria);
    if (this.filterPrecioMin !== null && this.filterPrecioMin !== undefined)
      result = result.filter(p => p.precio >= this.filterPrecioMin!);
    if (this.filterPrecioMax !== null && this.filterPrecioMax !== undefined)
      result = result.filter(p => p.precio <= this.filterPrecioMax!);
    this.filtered = result;
    this.cdr.detectChanges();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterCategoria = '';
    this.filterPrecioMin = null;
    this.filterPrecioMax = null;
    this.applyFilter();
  }

  get totalUnidades(): number { return this.products.reduce((a, p) => a + p.cantidad, 0); }
  get valorTotal(): number { return this.products.reduce((a, p) => a + p.precio * p.cantidad, 0); }

  openNew(): void {
    this.isEdit = false;
    this.currentProduct = this.emptyProduct();
    this.showModal = true;
    this.cdr.detectChanges();
  }

  openEdit(p: Product): void {
    this.isEdit = true;
    this.currentProduct = { ...p };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.cdr.detectChanges();
  }

  save(): void {
  if (this.isEdit && this.currentProduct._id) {
    this.productService.update(this.currentProduct._id, this.currentProduct).subscribe({
      next: () => {
        this.closeModal();
        this.loadProducts();
        this.showToast('Producto actualizado correctamente', 'success');
      },
      error: (e) => {
        const msg = e.error?.msg || 'Error al actualizar el producto';
        this.showToast(msg, 'error');
      }
    });
  } else {
    this.productService.create(this.currentProduct).subscribe({
      next: () => {
        this.closeModal();
        this.loadProducts();
        this.showToast('Producto creado correctamente', 'success');
      },
      error: (e) => {
        const msg = e.error?.msg || 'Error al crear el producto';
        this.showToast(msg, 'error');
      }
    });
  }
}

  openDelete(p: Product): void {
    this.productToDelete = p;
    this.showDeleteModal = true;
    this.cdr.detectChanges();
  }

  closeDelete(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
    this.cdr.detectChanges();
  }

  confirmDelete(): void {
    if (!this.productToDelete?._id) return;
    this.productService.delete(this.productToDelete._id).subscribe({
      next: () => {
        this.closeDelete();
        this.loadProducts();
        this.showToast('Producto eliminado del sistema', 'success');
      },
      error: () => this.showToast('Error al eliminar el producto', 'error')
    });
  }

  getEstado(p: Product): string {
    if (p.cantidad === 0) return 'Descontinuado';
    if (p.cantidad <= 5) return 'Stock Bajo';
    return 'Activo';
  }

  showToast(msg: string, type: 'success' | 'error'): void {
    this.toast = { msg, type };
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toast = null;
      this.cdr.detectChanges();
    }, 3000);
  }
}