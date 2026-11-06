import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RudriHeaderComponent } from '../../components/rudri-header/rudri-header.component';
import { PedidoService } from '../../services/pedido.service';
import { EstadoPedido } from '../../models/pedido.model';

@Component({
  selector: 'app-cocina',
  standalone: true,
  imports: [CommonModule, RudriHeaderComponent],
  templateUrl: './cocina.component.html',
  styleUrl: './cocina.component.css'
})
export class CocinaComponent {
  readonly pedidoService = inject(PedidoService);
  readonly mensajeFeedback = signal<string>('');

  cambiarEstado(idPedido: number, nuevoEstado: EstadoPedido): void {
    this.pedidoService.cambiarEstadoPedido(idPedido, nuevoEstado).subscribe({
      next: (ped) => {
        this.mensajeFeedback.set(`Pedido #${ped.codigo} actualizado a ${ped.estado}.`);
      },
      error: (err: Error) => {
        this.mensajeFeedback.set(err.message);
      }
    });
  }
}
