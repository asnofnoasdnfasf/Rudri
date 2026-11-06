import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_CONFIG } from './api.config';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly http = inject(HttpClient);

  readonly categorias = signal<Categoria[]>([
    {
      idCategoria: 1,
      nombre: 'COMIDA',
      descripcion: 'Cebiches, Mariscos, Arroces, Sopas y Chicharrones',
      icono: 'comida',
      activa: true
    },
    {
      idCategoria: 2,
      nombre: 'BEBIDAS',
      descripcion: 'Chicha morada, Limonadas, Refrescos y Bebidas heladas',
      icono: 'bebidas',
      activa: true
    },
    {
      idCategoria: 3,
      nombre: 'POSTRES',
      descripcion: 'Dulces criollos, Picarones, Suspiro y Helados',
      icono: 'postres',
      activa: true
    }
  ]);

  readonly subcategoriasPorCategoria: Record<number, string[]> = {
    1: ['Todos', 'Mariscos', 'Cebiches', 'Arroces', 'Sopas'],
    2: ['Todos', 'Jarras', 'Refrescos', 'Calientes'],
    3: ['Todos', 'Tradicionales', 'Helados']
  };

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(API_CONFIG.endpoints.categorias).pipe(
      tap((datos) => {
        if (datos && datos.length > 0) {
          this.categorias.set(datos);
        }
      }),
      catchError(() => of(this.categorias()))
    );
  }
}
