import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_CONFIG } from './api.config';
import { Mesa } from '../models/mesa.model';

const STORAGE_MESAS = 'rudri_mesas_data';

@Injectable({
  providedIn: 'root'
})
export class MesaService {
  private readonly http = inject(HttpClient);

  readonly mesas = signal<Mesa[]>(this.cargarMesasLocales());

  private obtenerMesasIniciales(): Mesa[] {
    return [
      { idMesa: 1, numero: 1, codigoFormateado: 'MESA 01', capacidad: 4, activa: true },
      { idMesa: 2, numero: 2, codigoFormateado: 'MESA 02', capacidad: 4, activa: true },
      { idMesa: 3, numero: 3, codigoFormateado: 'MESA 03', capacidad: 4, activa: true },
      { idMesa: 4, numero: 4, codigoFormateado: 'MESA 04', capacidad: 4, activa: true },
      { idMesa: 5, numero: 5, codigoFormateado: 'MESA 05', capacidad: 6, activa: true },
      { idMesa: 6, numero: 6, codigoFormateado: 'MESA 06', capacidad: 4, activa: true },
      { idMesa: 7, numero: 7, codigoFormateado: 'MESA 07', capacidad: 4, activa: true },
      { idMesa: 8, numero: 8, codigoFormateado: 'MESA 08', capacidad: 6, activa: true },
      { idMesa: 9, numero: 9, codigoFormateado: 'MESA 09', capacidad: 4, activa: true },
      { idMesa: 10, numero: 10, codigoFormateado: 'MESA 10', capacidad: 4, activa: true },
      { idMesa: 11, numero: 11, codigoFormateado: 'MESA 11', capacidad: 8, activa: true },
      { idMesa: 12, numero: 12, codigoFormateado: 'MESA 12', capacidad: 4, activa: true }
    ];
  }

  private cargarMesasLocales(): Mesa[] {
    try {
      const guardado = localStorage.getItem(STORAGE_MESAS);
      if (guardado) return JSON.parse(guardado);
    } catch {
      // Ignorar
    }
    return this.obtenerMesasIniciales();
  }

  private persistirLocal(lista: Mesa[]): void {
    this.mesas.set(lista);
    try {
      localStorage.setItem(STORAGE_MESAS, JSON.stringify(lista));
    } catch {
      // Ignorar
    }
  }

  listarMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(API_CONFIG.endpoints.mesas).pipe(
      tap((datos) => {
        const normalizadas = datos.map((m) => ({
          ...m,
          codigoFormateado: `MESA ${String(m.numero).padStart(2, '0')}`
        }));
        this.persistirLocal(normalizadas);
      }),
      catchError(() => of(this.mesas()))
    );
  }

  crearMesa(nueva: Omit<Mesa, 'idMesa'>): Observable<Mesa> {
    return this.http.post<Mesa>(API_CONFIG.endpoints.mesas, nueva).pipe(
      tap((creada) => {
        const lista = [...this.mesas(), { ...creada, codigoFormateado: `MESA ${String(creada.numero).padStart(2, '0')}` }];
        this.persistirLocal(lista);
      }),
      catchError(() => {
        const actual = this.mesas();
        const nuevoId = actual.length > 0 ? Math.max(...actual.map((m) => m.idMesa)) + 1 : 1;
        const mesaLocal: Mesa = {
          idMesa: nuevoId,
          numero: Number(nueva.numero),
          codigoFormateado: `MESA ${String(nueva.numero).padStart(2, '0')}`,
          capacidad: Number(nueva.capacidad || 4),
          activa: Boolean(nueva.activa)
        };
        this.persistirLocal([...actual, mesaLocal]);
        return of(mesaLocal);
      })
    );
  }

  actualizarMesa(mesa: Mesa): Observable<Mesa> {
    const formateada: Mesa = {
      ...mesa,
      codigoFormateado: `MESA ${String(mesa.numero).padStart(2, '0')}`
    };
    return this.http.put<Mesa>(`${API_CONFIG.endpoints.mesas}/${mesa.idMesa}`, formateada).pipe(
      tap(() => {
        this.persistirLocal(this.mesas().map((m) => (m.idMesa === mesa.idMesa ? formateada : m)));
      }),
      catchError(() => {
        this.persistirLocal(this.mesas().map((m) => (m.idMesa === mesa.idMesa ? formateada : m)));
        return of(formateada);
      })
    );
  }

  eliminarMesa(idMesa: number): Observable<void> {
    return this.http.delete<void>(`${API_CONFIG.endpoints.mesas}/${idMesa}`).pipe(
      tap(() => {
        this.persistirLocal(this.mesas().filter((m) => m.idMesa !== idMesa));
      }),
      catchError(() => {
        this.persistirLocal(this.mesas().filter((m) => m.idMesa !== idMesa));
        return of(undefined);
      })
    );
  }
}
