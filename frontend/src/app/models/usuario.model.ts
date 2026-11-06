export type NombreRol = 'MOZO' | 'COCINA' | 'ADMINISTRADOR';

export interface Rol {
  idRol: number;
  nombre: NombreRol | string;
  descripcion?: string;
}

/**
 * Coincide exactamente con backend.demo.dto.loginRequest de Spring Boot
 */
export interface LoginRequest {
  nombreUsuario: string;
  clave: string;
}

/**
 * Coincide exactamente con la respuesta JSON de authController.java (/api/auth/login)
 */
export interface LoginResponse {
  mensaje: string;
  idUsuario: number;
  nombreCompleto: string;
  nombreUsuario: string;
  rol: NombreRol | string;
}

export interface Usuario {
  idUsuario: number;
  nombreCompleto: string;
  nombreUsuario: string;
  rol: NombreRol | string;
  activo: boolean;
}
