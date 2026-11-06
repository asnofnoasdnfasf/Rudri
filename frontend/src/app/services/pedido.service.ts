import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_CONFIG } from './api.config';
import { DetallePedido, EstadoPedido, Pedido } from '../models/pedido.model';
import { Mesa } from '../models/mesa.model';
import { Producto } from '../models/producto.model';
import { AuthService } from './auth.service';

const STORAGE_PEDIDOS = 'rudri_pedidos_data';
const STORAGE_MESA_ACTIVA = 'rudri_mesa_seleccionada';
const STORAGE_CARRITO = 'rudri_carrito_actual';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private canalTiempoReal: BroadcastChannel | null = null;

  // Estado del pedido en armado por el mozo (Flujo Figma: Mesa -> Menú -> Confirmación)
  readonly mesaSeleccionada = signal<Mesa | null>(this.cargarMesaActiva());
  readonly itemsEnCarrito = signal<DetallePedido[]>(this.cargarCarritoLocal());
  readonly observacionGeneral = signal<string>('');

  // Lista general de pedidos enviados/registrados (Cocina KDS y Seguimiento)
  readonly pedidos = signal<Pedido[]>(this.cargarPedidosLocales());

  readonly totalArticulosCarrito = computed(() =>
    this.itemsEnCarrito().reduce((acc, item) => acc + item.cantidad, 0)
  );

  readonly totalMontoCarrito = computed(() =>
    Number(
      this.itemsEnCarrito()
        .reduce((acc, item) => acc + item.subtotal, 0)
        .toFixed(2)
    )
  );

  readonly pedidosPendientesCocina = computed(() =>
    this.pedidos()
      .filter((p) => p.estado === 'ENVIADO' || p.estado === 'EN_PREPARACION')
      .sort((a, b) => new Date(a.fechaHoraRegistro).getTime() - new Date(b.fechaHoraRegistro).getTime())
  );

  constructor() {
    this.configurarSincronizacionTiempoReal();
  }

  private configurarSincronizacionTiempoReal(): void {
    if (typeof window === 'undefined') return;
    if ('BroadcastChannel' in window) {
      this.canalTiempoReal = new BroadcastChannel('rudri_pedidos_sync');
      this.canalTiempoReal.onmessage = () => {
        this.pedidos.set(this.cargarPedidosLocales());
      };
    }
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_PEDIDOS) {
        this.pedidos.set(this.cargarPedidosLocales());
      }
    });
  }

  seleccionarMesa(mesa: Mesa): void {
    this.mesaSeleccionada.set(mesa);
    try {
      sessionStorage.setItem(STORAGE_MESA_ACTIVA, JSON.stringify(mesa));
    } catch {
      // Ignorar
    }
  }

  obtenerCantidadProductoEnCarrito(idProducto: number): number {
    const item = this.itemsEnCarrito().find((d) => d.producto.idProducto === idProducto);
    return item ? item.cantidad : 0;
  }

  /**
   * Actualiza o consolida la cantidad de un plato en el pedido actual.
   * Cumple la regla de negocio de HU-03 (cantidades entre 0 y 20 unidades).
   */
  actualizarCantidadProducto(producto: Producto, nuevaCantidad: number): { exito: boolean; mensaje: string } {
    if (!producto.disponible && nuevaCantidad > 0) {
      return { exito: false, mensaje: `El plato "${producto.nombre}" no está disponible actualmente.` };
    }

    if (!Number.isInteger(nuevaCantidad) || nuevaCantidad < 0 || nuevaCantidad > 20) {
      return { exito: false, mensaje: 'La cantidad por producto debe estar entre 1 y 20 unidades.' };
    }

    const actual = [...this.itemsEnCarrito()];
    const idx = actual.findIndex((d) => d.producto.idProducto === producto.idProducto);

    if (nuevaCantidad === 0) {
      if (idx >= 0) {
        actual.splice(idx, 1);
      }
    } else if (idx >= 0) {
      actual[idx] = {
        ...actual[idx],
        cantidad: nuevaCantidad,
        subtotal: Number((nuevaCantidad * producto.precio).toFixed(2))
      };
    } else {
      actual.push({
        producto,
        cantidad: nuevaCantidad,
        precioUnitario: producto.precio,
        subtotal: Number((nuevaCantidad * producto.precio).toFixed(2))
      });
    }

    this.itemsEnCarrito.set(actual);
    try {
      sessionStorage.setItem(STORAGE_CARRITO, JSON.stringify(actual));
    } catch {
      // Ignorar
    }
    return { exito: true, mensaje: 'Carrito actualizado.' };
  }

  limpiarCarrito(): void {
    this.itemsEnCarrito.set([]);
    this.observacionGeneral.set('');
    try {
      sessionStorage.removeItem(STORAGE_CARRITO);
    } catch {
      // Ignorar
    }
  }

  /**
   * Envía el pedido confirmado al Backend Spring Boot (/api/pedidos) y notifica a la pantalla de Cocina.
   */
  enviarPedidoACocina(): Observable<Pedido> {
    const mesa = this.mesaSeleccionada();
    const detalles = this.itemsEnCarrito();
    const usuario = this.authService.usuarioActual();
    const obs = this.observacionGeneral().trim();

    if (!mesa) {
      return throwError(() => new Error('Debes seleccionar una mesa antes de enviar el pedido.'));
    }
    if (detalles.length === 0) {
      return throwError(() => new Error('Agrega al menos un plato o bebida al pedido.'));
    }
    if (obs.length > 200) {
      return throwError(() => new Error('La observación no puede exceder los 200 caracteres.'));
    }

    const listaActual = this.pedidos();
    const nuevoId = listaActual.length > 0 ? Math.max(...listaActual.map((p) => p.idPedido)) + 1 : 1;
    const ahora = new Date().toISOString();

    const nuevoPedido: Pedido = {
      idPedido: nuevoId,
      codigo: String(nuevoId).padStart(3, '0'),
      idMesa: mesa.idMesa,
      numeroMesa: mesa.numero,
      idUsuario: usuario?.idUsuario || 1,
      nombreMozo: usuario?.nombreCompleto || 'Juan Pérez',
      fechaHoraRegistro: ahora,
      estado: 'ENVIADO',
      observacionGeneral: obs,
      detalles,
      totalArticulos: this.totalArticulosCarrito(),
      totalMonto: this.totalMontoCarrito(),
      historial: [
        { estado: 'REGISTRADO', fechaHora: ahora, usuario: usuario?.nombreUsuario || 'mozo01' },
        { estado: 'ENVIADO', fechaHora: ahora, usuario: usuario?.nombreUsuario || 'mozo01' }
      ]
    };

    return this.http.post<Pedido>(API_CONFIG.endpoints.pedidos, nuevoPedido).pipe(
      tap((creado) => {
        this.guardarPedidosLocales([...listaActual, creado || nuevoPedido]);
        this.limpiarCarrito();
      }),
      catchError(() => {
        this.guardarPedidosLocales([...listaActual, nuevoPedido]);
        this.limpiarCarrito();
        return of(nuevoPedido);
      })
    );
  }

  /**
   * Actualiza el estado de un pedido en Cocina (ENVIADO -> EN_PREPARACION -> DESPACHADO).
   */
  cambiarEstadoPedido(idPedido: number, nuevoEstado: EstadoPedido): Observable<Pedido> {
    const lista = this.pedidos();
    const idx = lista.findIndex((p) => p.idPedido === idPedido);
    if (idx < 0) {
      return throwError(() => new Error('Pedido no encontrado.'));
    }

    const actual = lista[idx];
    const transicionValida =
      (actual.estado === 'REGISTRADO' && nuevoEstado === 'ENVIADO') ||
      (actual.estado === 'ENVIADO' && nuevoEstado === 'EN_PREPARACION') ||
      (actual.estado === 'EN_PREPARACION' && nuevoEstado === 'DESPACHADO');

    if (!transicionValida) {
      return throwError(
        () => new Error(`Transición no permitida: no se puede pasar de ${actual.estado} a ${nuevoEstado}.`)
      );
    }

    const usuario = this.authService.usuarioActual();
    const actualizado: Pedido = {
      ...actual,
      estado: nuevoEstado,
      historial: [
        ...actual.historial,
        {
          estado: nuevoEstado,
          fechaHora: new Date().toISOString(),
          usuario: usuario?.nombreUsuario || 'cocina01'
        }
      ]
    };

    return this.http.patch<Pedido>(`${API_CONFIG.endpoints.pedidos}/${idPedido}/estado`, { estado: nuevoEstado }).pipe(
      tap(() => {
        const copia = [...lista];
        copia[idx] = actualizado;
        this.guardarPedidosLocales(copia);
      }),
      catchError(() => {
        const copia = [...lista];
        copia[idx] = actualizado;
        this.guardarPedidosLocales(copia);
        return of(actualizado);
      })
    );
  }

  eliminarPedido(idPedido: number): void {
    this.guardarPedidosLocales(this.pedidos().filter((p) => p.idPedido !== idPedido));
  }

  private guardarPedidosLocales(lista: Pedido[]): void {
    this.pedidos.set(lista);
    try {
      localStorage.setItem(STORAGE_PEDIDOS, JSON.stringify(lista));
      this.canalTiempoReal?.postMessage({ updated: Date.now() });
    } catch {
      // Ignorar
    }
  }

  private cargarPedidosLocales(): Pedido[] {
    try {
      const raw = localStorage.getItem(STORAGE_PEDIDOS);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignorar
    }
    const hace5Min = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    return [
      {
        idPedido: 1,
        codigo: '001',
        idMesa: 1,
        numeroMesa: 1,
        idUsuario: 1,
        nombreMozo: 'Juan Pérez',
        fechaHoraRegistro: hace5Min,
        estado: 'ENVIADO',
        observacionGeneral: 'Servir con ají limo aparte.',
        detalles: [
          {
            producto: {
              idProducto: 1,
              idCategoria: 1,
              nombre: 'CEVICHE CLÁSICO DRAGÓN MARINO',
              precio: 28.0,
              disponible: true,
              imagenUrl: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?auto=format&fit=crop&w=300&q=80'
            },
            cantidad: 2,
            precioUnitario: 28.0,
            subtotal: 56.0
          }
        ],
        totalArticulos: 2,
        totalMonto: 56.0,
        historial: [
          { estado: 'REGISTRADO', fechaHora: hace5Min, usuario: 'mozo01' },
          { estado: 'ENVIADO', fechaHora: hace5Min, usuario: 'mozo01' }
        ]
      }
    ];
  }

  private cargarMesaActiva(): Mesa | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_MESA_ACTIVA);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private cargarCarritoLocal(): DetallePedido[] {
    try {
      const raw = sessionStorage.getItem(STORAGE_CARRITO);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
