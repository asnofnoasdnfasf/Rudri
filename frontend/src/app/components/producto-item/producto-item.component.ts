import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto.model';
import { CantidadStepperComponent } from '../cantidad-stepper/cantidad-stepper.component';

@Component({
  selector: 'app-producto-item',
  standalone: true,
  imports: [CommonModule, CantidadStepperComponent],
  templateUrl: './producto-item.component.html',
  styleUrl: './producto-item.component.css'
})
export class ProductoItemComponent {
  @Input({ required: true }) producto!: Producto;
  @Input() cantidadActual = 0;
  @Output() cambiarCantidad = new EventEmitter<{ producto: Producto; cantidad: number }>();

  alCambiar(nuevaCantidad: number): void {
    this.cambiarCantidad.emit({ producto: this.producto, cantidad: nuevaCantidad });
  }
}
