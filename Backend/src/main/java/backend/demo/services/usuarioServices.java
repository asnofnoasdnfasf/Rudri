package backend.demo.services;
import backend.demo.model.usuarioModel;
import backend.demo.repository.usuarioRepository;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
@Service 
public class usuarioServices {
   private final usuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // Inyección de dependencias
    public usuarioServices(
            usuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Validar inicio de sesión
    public Optional<usuarioModel> autenticar(
            String nombreUsuario,
            String clave) {

        // Validar campos vacíos
        if (nombreUsuario == null || nombreUsuario.isBlank()
                || clave == null || clave.isBlank()) {
            return Optional.empty();
        }

        // Buscar usuario activo
        Optional<usuarioModel> usuario =
                usuarioRepository.findByNombreUsuarioAndActivoTrue(nombreUsuario);

        // Verificar contraseña
        return usuario.filter(
                u -> passwordEncoder.matches(
                        clave,
                        u.getClaveHash()
                )
        );
    }
}
