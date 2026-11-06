package backend.demo.repository;
import backend.demo.model.usuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface usuarioRepository extends JpaRepository<usuarioModel, Integer> {
 // Buscar usuario por nombre de usuario y recuperar su rol
    @EntityGraph(attributePaths = {"rol"})
    Optional<usuarioModel> findByNombreUsuario(String nombreUsuario);

    // Buscar únicamente cuentas activas
    @EntityGraph(attributePaths = {"rol"})
    Optional<usuarioModel> findByNombreUsuarioAndActivoTrue(String nombreUsuario);

}
