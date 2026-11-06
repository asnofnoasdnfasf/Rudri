import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  nombreUsuario = '';
  clave = '';
  readonly mostrarClave = signal<boolean>(false);
  readonly cargando = signal<boolean>(false);
  readonly mensajeError = signal<string>('');

  alternarVisibilidadClave(): void {
    this.mostrarClave.update((v) => !v);
  }

  autocompletar(usuario: string, pass: string): void {
    this.nombreUsuario = usuario;
    this.clave = pass;
    this.mensajeError.set('');
  }

  ingresar(): void {
    this.mensajeError.set('');
    this.cargando.set(true);

    this.authService
      .login({
        nombreUsuario: this.nombreUsuario,
        clave: this.clave
      })
      .subscribe({
        next: (respuesta) => {
          this.cargando.set(false);
          const rol = (respuesta.rol || '').toUpperCase();
          if (rol === 'COCINA') {
            this.router.navigate(['/cocina']);
          } else if (rol === 'ADMINISTRADOR') {
            this.router.navigate(['/crud']);
          } else {
            this.router.navigate(['/mesas']);
          }
        },
        error: (err: Error) => {
          this.cargando.set(false);
          this.mensajeError.set(err.message || 'Credenciales incorrectas');
        }
      });
  }
}
