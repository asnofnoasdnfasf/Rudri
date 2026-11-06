import { Producto } from './producto.model';

export type EstadoPedido = 'REGISTRADO' | 'ENVIADO' | 'EN_PREPARACION' | 'DESPACHADO';

export interface DetallePedido {
  idDetalle?: number;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  observacion?: string;
}

export interface HistorialEstado {
  estado: EstadoPedido;
  fechaHora: string;
  usuario: string;
}

export interface Pedido {
  idPedido: number;
  codigo: string;
  idMesa: number;
  numeroMesa: number;
  idUsuario: number;
  nombreMozo: string;
  fechaHoraRegistro: string;
  estado: EstadoPedido;
  observacionGeneral?: string;
  detalles: DetallePedido[];
  totalArticulos: number;
  totalMonto: number;
  historial: HistorialEstado[];
}
