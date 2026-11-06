/**
 * Coincide con backend.demo.model.mesaModel de Spring Boot
 */
export interface Mesa {
  idMesa: number;
  numero: number;
  codigoFormateado?: string; // Ej: "MESA 01"
  capacidad: number;
  activa: boolean;
  ocupada?: boolean;
}
