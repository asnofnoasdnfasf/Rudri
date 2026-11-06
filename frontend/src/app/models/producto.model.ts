import { Categoria } from './categoria.model';

/**
 * Coincide con backend.demo.model.productoModel de Spring Boot
 */
export interface Producto {
  idProducto: number;
  idCategoria: number;
  categoria?: Categoria;
  nombre: string;
  subcategoria?: string; // Ej: "Mariscos", "Criollos", "Refrescos", "Postres"
  descripcion?: string;
  precio: number;
  disponible: boolean;
  imagenUrl: string;
}
