package ec.edu.espe.subasta.autos.api;

import ec.edu.espe.subasta.autos.api.DTO.LoginDTO;
import ec.edu.espe.subasta.autos.api.DTO.RegisterDTO;
import ec.edu.espe.subasta.autos.entity.RoleEntity;
import ec.edu.espe.subasta.autos.entity.UsuarioEntity;
import ec.edu.espe.subasta.autos.exception.AccountNotFound;
import ec.edu.espe.subasta.autos.exception.InvalidCredentialsException;
import ec.edu.espe.subasta.autos.repository.RolRepository;
import ec.edu.espe.subasta.autos.repository.UsuarioRepository;
import ec.edu.espe.subasta.autos.repository.UsuarioRolRepository;
import ec.edu.espe.subasta.autos.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(
        maxAge = 3600L
)
@RestController
@RequestMapping({"/api/auth"})
public class AuthController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioRolRepository usuarioRolRepository;
    private final RolRepository rolRepository;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    public AuthController(UsuarioService usuarioService, UsuarioRepository usuarioRepository, UsuarioRolRepository usuarioRolRepository, RolRepository rolRepository, PasswordEncoder passwordEncoder) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.usuarioRolRepository = usuarioRolRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
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

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterDTO registerDTO) {
        try {
            if (usuarioRepository.existsByEmail(registerDTO.getEmail())) {
                return new ResponseEntity<>("El email ya está en uso", HttpStatus.BAD_REQUEST);
            }

            // Crear nuevo usuario
            UsuarioEntity usuario = new UsuarioEntity();
            usuario.setNombre(registerDTO.getNombre());
            usuario.setEmail(registerDTO.getEmail());
            usuario.setContraseniaHash(passwordEncoder.encode(registerDTO.getContraseniaHash()));
            usuario.setActivo(true);
            usuario.setFechaRegistro(LocalDate.now());

            UsuarioEntity usuarioGuardado = usuarioRepository.save(usuario);

            // Asignar automáticamente el rol COMPRADOR
            RoleEntity rolComprador = rolRepository.findByNombre("COMPRADOR")
                    .orElseThrow(() -> new RuntimeException("Rol COMPRADOR no encontrado"));

            usuarioRolRepository.asignarRol(usuarioGuardado.getId(), rolComprador.getId());

            return ResponseEntity.ok("Usuario registrado con éxito");

        } catch (Exception e) {
            return new ResponseEntity<>("Error al registrar usuario: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}