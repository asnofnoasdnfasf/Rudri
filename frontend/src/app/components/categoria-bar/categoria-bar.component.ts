import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-categoria-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categoria-bar.component.html',
  styleUrl: './categoria-bar.component.css'
})
export class CategoriaBarComponent {
  @Input({ required: true }) categorias: Categoria[] = [];
  @Input({ required: true }) idCategoriaActiva = 1;
  @Output() cambiarCategoria = new EventEmitter<number>();

  seleccionar(idCategoria: number): void {
    this.cambiarCategoria.emit(idCategoria);
  }

  siguienteCategoria(): void {
    if (!this.categorias.length) return;
    const idx = this.categorias.findIndex((c) => c.idCategoria === this.idCategoriaActiva);
    const sig = (idx + 1) % this.categorias.length;
    this.cambiarCategoria.emit(this.categorias[sig].idCategoria);
  }
}
