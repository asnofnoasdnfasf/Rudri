import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mesa } from '../../models/mesa.model';

@Component({
  selector: 'app-mesa-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mesa-card.component.html',
  styleUrl: './mesa-card.component.css'
})
export class MesaCardComponent {
  @Input({ required: true }) mesa!: Mesa;
  @Input() seleccionada = false;
  @Output() seleccionar = new EventEmitter<Mesa>();

  alHacerClick(): void {
    if (this.mesa.activa) {
      this.seleccionar.emit(this.mesa);
    }
  }
}
