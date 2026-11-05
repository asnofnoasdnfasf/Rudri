package backend.demo.controller;
import backend.demo.dto.loginRequest;
import backend.demo.model.usuarioModel;
import backend.demo.services.usuarioServices;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class authController {
 private final usuarioServices usuarioService;

    public authController(usuarioServices usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody loginRequest request) {

        var resultado = usuarioService.autenticar(
            request.getNombreUsuario(),
            request.getClave()
        );

        if (resultado.isEmpty()) {
            return ResponseEntity.status(401).body(
                Map.of("mensaje", "Credenciales incorrectas")
            );
        }

        usuarioModel usuario = resultado.get();

        return ResponseEntity.ok(
            Map.of(
                "mensaje", "Inicio de sesión exitoso",
                "idUsuario", usuario.getIdUsuario(),
                "nombreCompleto", usuario.getNombreCompleto(),
                "nombreUsuario", usuario.getNombreUsuario(),
                "rol", usuario.getRol().getNombre()
            )
        );
    }
}
