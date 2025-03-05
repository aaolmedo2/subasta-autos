package ec.edu.espe.subasta.autos.api;

import ec.edu.espe.subasta.autos.api.DTO.AutoDTO;
import ec.edu.espe.subasta.autos.api.DTO.UsuarioRolDTO;
import ec.edu.espe.subasta.autos.exception.InsertException;
import ec.edu.espe.subasta.autos.service.UsuarioRolService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/userRol")
public class UsuarioRolController {
    private final UsuarioRolService usuarioRolService;

    private static final Logger logger = LoggerFactory.getLogger(AutoController.class);

    private static final int ROL_VENDEDOR_ID = 1; // ID fijo para el rol "vendedor"

    public UsuarioRolController(UsuarioRolService usuarioRolService) {
        this.usuarioRolService = usuarioRolService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUserRol(@RequestBody UsuarioRolDTO usuarioRolDTO) {
        try {
            usuarioRolService.create(usuarioRolDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Usuario emparejado con un rol exitosamente"));
        } catch (InsertException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PutMapping("/usuario/{userId}")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Integer userId,
            @RequestBody UsuarioRolDTO usuarioRolDTO) {
        try {
            this.usuarioRolService.update(userId, usuarioRolDTO);
            return ResponseEntity.ok().body("Rol actualizado exitosamente para el usuario");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{usuarioId}/{rolId}")
    public ResponseEntity<?> deleteUserRole(
            @PathVariable Integer usuarioId,
            @PathVariable Integer rolId) {
        try {
            this.usuarioRolService.delete(usuarioId, rolId);
            return ResponseEntity.ok().body("Rol eliminado exitosamente del usuario");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllUserRoles() {
        try {
            List<Map<String, Object>> userRoles = this.usuarioRolService.getAllUsuariosRoles();
            return ResponseEntity.ok().body(userRoles);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al obtener usuarios y roles: " + e.getMessage());
        }
    }

    @PostMapping("/asignar/{userId}")
    public ResponseEntity<String> assignSellerRole(@PathVariable Integer userId) {
        try {
            usuarioRolService.assignNewRoleToUser(userId, ROL_VENDEDOR_ID);
            return ResponseEntity.ok("Rol 'vendedor' asignado correctamente al usuario con ID " + userId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
