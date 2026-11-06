import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { AuthService } from './services/auth.service';
import { ProductoService } from './services/producto.service';
import { PedidoService } from './services/pedido.service';
import { MesaService } from './services/mesa.service';

describe('RUDRI Frontend - Pruebas de Servicios y Componentes', () => {
  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideRouter([])]
    }).compileComponents();
  });

  it('Debería instanciar la aplicación raíz RUDRI', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('MesaService debería listar las 12 mesas iniciales', () => {
    const mesaService = TestBed.inject(MesaService);
    expect(mesaService.mesas().length).toBe(12);
    expect(mesaService.mesas()[0].codigoFormateado).toBe('MESA 01');
  });

  it('ProductoService debería listar el catálogo y permitir agregar y actualizar cantidades en PedidoService', () => {
    const productoService = TestBed.inject(ProductoService);
    const pedidoService = TestBed.inject(PedidoService);
    const ceviche = productoService.productos()[0];

    const res = pedidoService.actualizarCantidadProducto(ceviche, 2);
    expect(res.exito).toBe(true);
    expect(pedidoService.totalArticulosCarrito()).toBe(2);
    expect(pedidoService.totalMontoCarrito()).toBe(56.0);
  });

  it('AuthService debería rechazar intento de Inyección SQL (OWASP CP-40)', () => {
    const authService = TestBed.inject(AuthService);
    let mensajeError = '';
    authService.login({ nombreUsuario: "' OR '1'='1", clave: '123' }).subscribe({
      error: (err: Error) => {
        mensajeError = err.message;
      }
    });
    expect(mensajeError).toContain('OWASP');
  });
});
