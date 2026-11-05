package backend.demo.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(
    name = "usuario",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_usuario_nombre",
            columnNames = "nombre_usuario"
        )
    }
)
public class usuarioModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "id_rol",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_usuario_rol")
    )
    private rolModel rol;

    @Column(name = "nombre_completo", length = 100, nullable = false)
    private String nombreCompleto;

    @Column(name = "nombre_usuario", length = 30, nullable = false, unique = true)
    private String nombreUsuario;

    @Column(name = "clave_hash", length = 255, nullable = false)
    private String claveHash;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    // Constructor vacío
    public usuarioModel() {
    }

    // Se ejecuta antes de insertar
    @PrePersist
    protected void alCrear() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
    }

    // Getters y Setters

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public rolModel getRol() {
        return rol;
    }

    public void setRol(rolModel rol) {
        this.rol = rol;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getClaveHash() {
        return claveHash;
    }

    public void setClaveHash(String claveHash) {
        this.claveHash = claveHash;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
