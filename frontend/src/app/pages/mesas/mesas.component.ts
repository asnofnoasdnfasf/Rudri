import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RudriHeaderComponent } from '../../components/rudri-header/rudri-header.component';
import { MesaCardComponent } from '../../components/mesa-card/mesa-card.component';
import { MesaService } from '../../services/mesa.service';
import { PedidoService } from '../../services/pedido.service';
import { Mesa } from '../../models/mesa.model';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule, RudriHeaderComponent, MesaCardComponent],
  templateUrl: './mesas.component.html',
  styleUrl: './mesas.component.css'
})
export class MesasComponent implements OnInit {
  readonly mesaService = inject(MesaService);
  readonly pedidoService = inject(PedidoService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.mesaService.listarMesas().subscribe();
  }

  elegirMesa(mesa: Mesa): void {
    this.pedidoService.seleccionarMesa(mesa);
    this.router.navigate(['/menu']);
  }
}
