package ec.edu.espe.subasta.autos.service;

import ec.edu.espe.subasta.autos.api.DTO.AutoDTO;
import ec.edu.espe.subasta.autos.api.DTO.UsuarioDTO;
import ec.edu.espe.subasta.autos.entity.AutoEntity;
import ec.edu.espe.subasta.autos.entity.RoleEntity;
import ec.edu.espe.subasta.autos.entity.UsuarioEntity;
import ec.edu.espe.subasta.autos.entity.UsuariosRoleEntity;
import ec.edu.espe.subasta.autos.exception.*;
import ec.edu.espe.subasta.autos.repository.RolRepository;
import ec.edu.espe.subasta.autos.repository.UsuarioRepository;
import ec.edu.espe.subasta.autos.repository.UsuarioRolRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final UsuarioRolRepository usuarioRolRepository;
    private final PasswordEncoder passwordEncoder;

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    private String msgError;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository, RolRepository rolRepository, UsuarioRolRepository usuarioRolRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.usuarioRolRepository = usuarioRolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    //crear usuario
    public void create(UsuarioDTO usuarioDTO) throws InsertException {
        try {

            // Crear el usuario
            UsuarioEntity usuarioToCreate = new UsuarioEntity();
            usuarioToCreate.setNombre(usuarioDTO.getNombre());
            usuarioToCreate.setEmail(usuarioDTO.getEmail());
            usuarioToCreate.setContraseniaHash(usuarioDTO.getPassword());
            usuarioToCreate.setActivo(usuarioDTO.isActivo());
            usuarioToCreate.setFechaRegistro(usuarioDTO.getFecha_registro());

            // Guardar el vehículo en la base de datos
            usuarioRepository.save(usuarioToCreate);

        } catch(Exception exception){
            this.msgError = this.msgError == null ? "Error creating new usuario" : this.msgError;
            throw new InsertException(this.msgError, AutoEntity.class.getName());
        }
    }

    //update user for admin
    public void update(Integer id, UsuarioDTO usuarioDTO) throws Exception {
        try {
            // Find the user
            UsuarioEntity existingUser = this.usuarioRepository.findById(id)
                    .orElseThrow(() -> new DocumentNotFoundException("User no encontrado", UsuarioEntity.class.getName()));


            // Update fields
            existingUser.setNombre(usuarioDTO.getNombre());
            existingUser.setEmail(usuarioDTO.getEmail());
            existingUser.setContraseniaHash(usuarioDTO.getPassword());
            existingUser.setActivo(usuarioDTO.isActivo());
            //dont change the date bc isn't logic

            // Save the updated vehicle
            this.usuarioRepository.save(existingUser);

        } catch (DocumentNotFoundException exception) {
            throw exception;
        } catch (Exception exception) {
            this.msgError = this.msgError == null ? "Error updating user" : this.msgError;
            throw new Exception(this.msgError);
        }
    }

    // logic delete vehicle
    public void delete(Integer id) throws DeleteException {
        try {
            Optional<UsuarioEntity> userEntityOptional = this.usuarioRepository.findById(id);

            if (!userEntityOptional.isPresent()) {
                this.msgError = "User doesn't exist";
                throw new DeleteException(this.msgError, AutoEntity.class.getName());
            }

            userEntityOptional.get().setActivo(false);
            this.usuarioRepository.save(userEntityOptional.get());

        } catch (Exception exception) {
            this.msgError = this.msgError == null ? "Error deleting user" : this.msgError;
            throw new DeleteException(this.msgError, AutoEntity.class.getName());
        }
    }

    //get all user
    public List<UsuarioDTO> getAllUser() {
        try {
            List<UsuarioEntity> userEntities = this.usuarioRepository.findAll();
            return userEntities.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching all users", e);
            throw new RuntimeException("Error al obtener los usuarios", e);
        }
    }

    // Helper method to convert Entity to DTO
    private UsuarioDTO convertToDTO(UsuarioEntity usuarioEntity) {
        UsuarioDTO usuarioDTO = new UsuarioDTO();
        usuarioDTO.setNombre(usuarioEntity.getNombre());
        usuarioDTO.setEmail(usuarioEntity.getEmail());
        usuarioDTO.setPassword(usuarioEntity.getContraseniaHash());
        usuarioDTO.setActivo(usuarioEntity.getActivo());
        usuarioDTO.setFecha_registro(usuarioEntity.getFechaRegistro());
        return usuarioDTO;
    }

    ///  LOGIN AND REGISTER
    public String login(String email, String password) throws InvalidCredentialsException, AccountNotFound {
        UsuarioEntity usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new AccountNotFound("Account does not exist"));

        if (!passwordEncoder.matches(password, usuario.getContraseniaHash())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        List<RoleEntity> roles = usuarioRolRepository.findRolesByUsuarioId(usuario.getId());

        if (roles.isEmpty()) {
            throw new RuntimeException("Usuario no tiene roles asignados");
        }

        List<String> authorities = roles.stream()
                .map(role -> "ROLE_" + role.getNombre())
                .collect(Collectors.toList());

        String authority = authorities.stream().collect(Collectors.joining(","));

        return ((JwtBuilder)((JwtBuilder)((JwtBuilder) Jwts.builder()
                .setId(UUID.randomUUID().toString()))
                .setSubject(usuario.getEmail()))
                .claim("authority", authority)
                .claim("userId", usuario.getId()) // Agrega el id en el jwt
                .issuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 3600000L)))
                .signWith(generateKeyFromSecret(), SignatureAlgorithm.HS256)
                .compact();
    }

    private SecretKey generateKeyFromSecret() {
        try {
            String secret = "CONTRASENIA: 1234";
            MessageDigest sha = MessageDigest.getInstance("SHA-512");
            byte[] keyBytes = sha.digest(secret.getBytes());
            return new SecretKeySpec(keyBytes, "HmacSHA512");
        } catch (Exception exception) {
            throw new RuntimeException("Erroe getting key: " + String.valueOf(exception));
        }
    }

}
