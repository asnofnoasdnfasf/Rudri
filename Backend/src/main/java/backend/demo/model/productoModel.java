package backend.demo.model;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "producto",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_producto_nombre",
            columnNames = "nombre"
        )
    }
)
public class productoModel {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Integer idProducto;

  @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "id_categoria",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_producto_categoria")
    )
    private categoriaModel categoria;

    @Column(name = "nombre", length = 100, nullable = false)
    private String nombre;

    @Column(name = "precio", precision = 8, scale = 2, nullable = false)
    private BigDecimal precio;

    @Column(name = "disponible", nullable = false)
    private Boolean disponible = true;

    // Constructor vacío
    public productoModel() {
    }

    // Getters y Setters

    public Integer getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
    }

    public categoriaModel getCategoria() {
        return categoria;
    }

    public void setCategoria(categoriaModel categoria) {
        this.categoria = categoria;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public Boolean getDisponible() {
        return disponible;
    }

    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }


}
