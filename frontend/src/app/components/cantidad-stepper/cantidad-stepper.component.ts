import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cantidad-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cantidad-stepper.component.html',
  styleUrl: './cantidad-stepper.component.css'
})
export class CantidadStepperComponent {
  @Input() cantidad = 0;
  @Input() min = 0;
  @Input() max = 20;
  @Input() deshabilitado = false;
  @Input() variante: 'suave' | 'solido' = 'suave';
  @Output() cambioCantidad = new EventEmitter<number>();

  disminuir(): void {
    if (this.deshabilitado || this.cantidad <= this.min) return;
    this.cambioCantidad.emit(this.cantidad - 1);
  }

  aumentar(): void {
    if (this.deshabilitado || this.cantidad >= this.max) return;
    this.cambioCantidad.emit(this.cantidad + 1);
  }
}
