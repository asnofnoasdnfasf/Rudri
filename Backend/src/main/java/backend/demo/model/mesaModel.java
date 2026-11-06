package backend.demo.model;
import jakarta.persistence.*;

@Entity
@Table(
    name = "mesa",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_mesa_numero",
            columnNames = "numero"
        )
    }
)
public class mesaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mesa")
    private Integer idMesa;

    @Column(name = "numero", nullable = false)
    private Integer numero;

    @Column(name = "capacidad")
    private Integer capacidad;

    @Column(name = "activa", nullable = false)
    private Boolean activa = true;

    // Constructor vacío
    public mesaModel() {
    }

    // Getters y Setters

    public Integer getIdMesa() {
        return idMesa;
    }

    public void setIdMesa(Integer idMesa) {
        this.idMesa = idMesa;
    }

    public Integer getNumero() {
        return numero;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public Integer getCapacidad() {
        return capacidad;
    }

    public void setCapacidad(Integer capacidad) {
        this.capacidad = capacidad;
    }

    public Boolean getActiva() {
        return activa;
    }

    public void setActiva(Boolean activa) {
        this.activa = activa;
    }
}
