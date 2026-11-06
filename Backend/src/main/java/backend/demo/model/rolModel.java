package backend.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(
    name = "rol",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_rol_nombre",
            columnNames = "nombre"
        )
    }
)
public class rolModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Integer idRol;

    @Column(name = "nombre", length = 30, nullable = false, unique = true)
    private String nombre;

    @Column(name = "descripcion", length = 100)
    private String descripcion;

    // Constructor vacío
    public rolModel() {
    }

    // Getters y Setters

    public Integer getIdRol() {
        return idRol;
    }

    public void setIdRol(Integer idRol) {
        this.idRol = idRol;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
