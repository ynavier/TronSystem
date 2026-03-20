export interface Product {
  _id?:        string;
  nombre:      string;
  descripcion: string;
  precio:      number;
  cantidad:    number;
  categoria:   string;
  createdAt?:  string;
}