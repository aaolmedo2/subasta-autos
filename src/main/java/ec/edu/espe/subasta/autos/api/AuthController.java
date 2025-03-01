package ec.edu.espe.subasta.autos.api;

import ec.edu.espe.subasta.autos.api.DTO.LoginDTO;
import ec.edu.espe.subasta.autos.exception.AccountNotFound;
import ec.edu.espe.subasta.autos.exception.InvalidCredentialsException;
import ec.edu.espe.subasta.autos.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(
        maxAge = 3600L
)
@RestController
@RequestMapping({"/api/authorization-server"})
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }


    @PostMapping({"/login"})
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {
        try {
            return ResponseEntity.ok(this.usuarioService.login(loginDTO.getEmail(), loginDTO.getPassword()));
        } catch (AccountNotFound var3) {
            return ResponseEntity.notFound().build();
        } catch (InvalidCredentialsException var4) {
            return ResponseEntity.badRequest().build();
        }
    }
}