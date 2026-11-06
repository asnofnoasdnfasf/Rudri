import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-rudri-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './rudri-header.component.html',
  styleUrl: './rudri-header.component.css'
})
export class RudriHeaderComponent {
  readonly authService = inject(AuthService);
  readonly pedidoService = inject(PedidoService);
  private readonly router = inject(Router);

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
