package ec.edu.espe.subasta.autos.api;

import ec.edu.espe.subasta.autos.api.DTO.AutoDTO;
import ec.edu.espe.subasta.autos.api.DTO.UsuarioDTO;
import ec.edu.espe.subasta.autos.exception.DeleteException;
import ec.edu.espe.subasta.autos.exception.DocumentNotFoundException;
import ec.edu.espe.subasta.autos.exception.InsertException;
import ec.edu.espe.subasta.autos.service.UsuarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {
    private final UsuarioService usuarioService;

    private static final Logger logger = LoggerFactory.getLogger(AutoController.class);

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody UsuarioDTO usuarioDTO) {
        try {
            usuarioService.create(usuarioDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Usuario creado exitosamente"));
        } catch (InsertException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    //update user
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody UsuarioDTO usuarioDTO) {
        try {
            this.usuarioService.update(id, usuarioDTO);
            return ResponseEntity.ok().body("Usuario actualizado exitosamente");
        } catch (DocumentNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el usaurio: " + e.getMessage());
        }
    }

    // logic Delete user
    @PutMapping("/delete/{id}")
    public ResponseEntity deleteUser(@PathVariable Integer id) throws DeleteException {
        try{
            usuarioService.delete(id);
            return ResponseEntity.ok().body("Usuario eliminado exitosamente");
        }
        catch (DeleteException deleteException) {
            return ResponseEntity.badRequest().body(deleteException.getMessage());
        }
    }

    // get all users
    @GetMapping("/allUser")
    public ResponseEntity<List<UsuarioDTO>> getAllUsers() {
        return ResponseEntity.ok(usuarioService.getAllUser());
    }
}
