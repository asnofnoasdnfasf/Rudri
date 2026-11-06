import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RudriHeaderComponent } from '../../components/rudri-header/rudri-header.component';
import { CategoriaBarComponent } from '../../components/categoria-bar/categoria-bar.component';
import { ProductoItemComponent } from '../../components/producto-item/producto-item.component';
import { CategoriaService } from '../../services/categoria.service';
import { ProductoService } from '../../services/producto.service';
import { PedidoService } from '../../services/pedido.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RudriHeaderComponent,
    CategoriaBarComponent,
    ProductoItemComponent
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  readonly categoriaService = inject(CategoriaService);
  readonly productoService = inject(ProductoService);
  readonly pedidoService = inject(PedidoService);
  private readonly router = inject(Router);

  readonly idCategoriaActiva = signal<number>(1);
  readonly subcategoriaActiva = signal<string>('Mariscos');
  readonly textoBusqueda = signal<string>('');
  readonly mensajeAviso = signal<string>('');

  readonly subcategoriasDisponibles = computed(
    () => this.categoriaService.subcategoriasPorCategoria[this.idCategoriaActiva()] || ['Todos']
  );

  readonly productosFiltrados = computed(() => {
    const idCat = this.idCategoriaActiva();
    const sub = this.subcategoriaActiva();
    const busqueda = this.textoBusqueda().trim().toLowerCase();

    return this.productoService.productos().filter((p) => {
      const coincideCat = p.idCategoria === idCat;
      const coincideSub =
        sub === 'Todos' || !p.subcategoria || p.subcategoria.toLowerCase() === sub.toLowerCase();
      const coincideTexto =
        !busqueda ||
        p.nombre.toLowerCase().includes(busqueda) ||
        (p.descripcion || '').toLowerCase().includes(busqueda);
      return coincideCat && coincideSub && coincideTexto;
    });
  });

  ngOnInit(): void {
    this.categoriaService.listarCategorias().subscribe();
    this.productoService.listarProductos().subscribe();
  }

  cambiarCategoria(idCategoria: number): void {
    this.idCategoriaActiva.set(idCategoria);
    this.subcategoriaActiva.set('Todos');
  }

  actualizarCantidad(evento: { producto: Producto; cantidad: number }): void {
    const res = this.pedidoService.actualizarCantidadProducto(evento.producto, evento.cantidad);
    if (!res.exito) {
      this.mensajeAviso.set(res.mensaje);
    } else {
      this.mensajeAviso.set('');
    }
  }

  irAConfirmacion(): void {
    if (this.pedidoService.totalArticulosCarrito() === 0) {
      this.mensajeAviso.set('Selecciona al menos un plato o bebida antes de continuar.');
      return;
    }
    this.router.navigate(['/confirmacion']);
  }
}
