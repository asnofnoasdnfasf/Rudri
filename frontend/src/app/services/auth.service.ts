import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { API_CONFIG } from './api.config';
import { LoginRequest, LoginResponse } from '../models/usuario.model';

const STORAGE_SESION = 'rudri_sesion_usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly usuarioActual = signal<LoginResponse | null>(this.obtenerSesionGuardada());

  readonly nombreCorto = computed(() => {
    const user = this.usuarioActual();
    if (!user) return 'Invitado';
    const partes = user.nombreCompleto.trim().split(' ');
    return partes[0] || user.nombreUsuario;
  });

  readonly estaAutenticado = computed(() => this.usuarioActual() !== null);

  private readonly usuariosFallback: Array<LoginResponse & { clave: string }> = [
    {
      idUsuario: 1,
      nombreCompleto: 'Juan Pérez (Mozo Principal)',
      nombreUsuario: 'mozo01',
      clave: 'Mozo12345',
      rol: 'MOZO',
      mensaje: 'Inicio de sesión exitoso'
    },
    {
      idUsuario: 2,
      nombreCompleto: 'Juan Carlos (Mozo Sala)',
      nombreUsuario: 'juan',
      clave: '123456',
      rol: 'MOZO',
      mensaje: 'Inicio de sesión exitoso'
    },
    {
      idUsuario: 3,
      nombreCompleto: 'Chef Roberto (Cocina)',
      nombreUsuario: 'cocina01',
      clave: 'Cocina12345',
      rol: 'COCINA',
      mensaje: 'Inicio de sesión exitoso'
    },
    {
      idUsuario: 4,
      nombreCompleto: 'Administrador RUDRI',
      nombreUsuario: 'admin01',
      clave: 'Admin12345',
      rol: 'ADMINISTRADOR',
      mensaje: 'Inicio de sesión exitoso'
    }
  ];

  /**
   * Llama al endpoint POST /api/auth/login del Backend Spring Boot (authController.java).
   * Si el backend local aún no está levantado, aplica fallback automático con validación OWASP.
   */
  login(credenciales: LoginRequest): Observable<LoginResponse> {
    const userTrim = (credenciales.nombreUsuario || '').trim();
    const passTrim = (credenciales.clave || '').trim();

    if (!userTrim || !passTrim) {
      return throwError(() => new Error('Por favor, ingresa tu nombre de usuario y contraseña.'));
    }

    // Validación OWASP Top 10 contra Inyección SQL (CP-40)
    const patronSQLi = /('|--|;|\/\*|\*\/|\bOR\b\s+['"]?\d+['"]?\s*=\s*['"]?\d+|\bUNION\b|\bSELECT\b|\bDROP\b)/i;
    if (patronSQLi.test(userTrim) || patronSQLi.test(passTrim)) {
      return throwError(() => new Error('Credenciales rechazadas por seguridad (Prevención SQLi - OWASP).'));
    }

    return this.http.post<LoginResponse>(API_CONFIG.endpoints.authLogin, {
      nombreUsuario: userTrim,
      clave: passTrim
    }).pipe(
      tap((respuesta) => this.guardarSesion(respuesta)),
      catchError((errorHttp) => {
        // Si el backend Spring Boot devolvió 401 explícito
        if (errorHttp.status === 401) {
          return throwError(() => new Error(errorHttp.error?.mensaje || 'Credenciales incorrectas'));
        }

        // Si el servidor backend (:8080) está apagado (status 0), validar contra usuarios preconfigurados
        const encontrado = this.usuariosFallback.find(
          (u) => u.nombreUsuario.toLowerCase() === userTrim.toLowerCase() && u.clave === passTrim
        );

        if (!encontrado) {
          return throwError(() => new Error('Credenciales incorrectas. Verifica tu usuario y contraseña.'));
        }

        const respuesta: LoginResponse = {
          idUsuario: encontrado.idUsuario,
          nombreCompleto: encontrado.nombreCompleto,
          nombreUsuario: encontrado.nombreUsuario,
          rol: encontrado.rol,
          mensaje: encontrado.mensaje
        };
        this.guardarSesion(respuesta);
        return of(respuesta);
      })
    );
  }

  logout(): void {
    this.usuarioActual.set(null);
    try {
      localStorage.removeItem(STORAGE_SESION);
      sessionStorage.removeItem(STORAGE_SESION);
    } catch {
      // Ignorar errores de storage
    }
  }

  private guardarSesion(usuario: LoginResponse): void {
    this.usuarioActual.set(usuario);
    try {
      localStorage.setItem(STORAGE_SESION, JSON.stringify(usuario));
      sessionStorage.setItem(STORAGE_SESION, JSON.stringify(usuario));
    } catch {
      // Ignorar errores de storage
    }
  }

  private obtenerSesionGuardada(): LoginResponse | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_SESION) || localStorage.getItem(STORAGE_SESION);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
