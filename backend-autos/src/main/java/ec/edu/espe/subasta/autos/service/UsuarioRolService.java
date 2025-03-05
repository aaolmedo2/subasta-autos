package ec.edu.espe.subasta.autos.service;

import ec.edu.espe.subasta.autos.api.DTO.UsuarioRolDTO;
import ec.edu.espe.subasta.autos.entity.*;
import ec.edu.espe.subasta.autos.exception.InsertException;
import ec.edu.espe.subasta.autos.repository.RolRepository;
import ec.edu.espe.subasta.autos.repository.UsuarioRepository;
import ec.edu.espe.subasta.autos.repository.UsuarioRolRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UsuarioRolService {
    private final UsuarioRolRepository usuarioRolRepository;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;

    private static final Logger logger = LoggerFactory.getLogger(AutoService.class);

    public UsuarioRolService(UsuarioRolRepository usuarioRolRepository, UsuarioRepository usuarioRepository, RolRepository rolRepository) {
        this.usuarioRolRepository = usuarioRolRepository;
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;

    }


    private String msgError;

    // CREAR = ASIGNAR UN ROL AL USUARIO
    public void create(UsuarioRolDTO usuarioRolDTO) throws InsertException{
       try {
           // Create composite key
           UsuariosRoleEntityId compositeId = new UsuariosRoleEntityId(
                   usuarioRolDTO.getId_usuario(),
                   usuarioRolDTO.getId_rol()
           );

           // Validate if the role assignment already exists
           if (usuarioRolRepository.existsByUsuarioIdAndRolId(
                   usuarioRolDTO.getId_usuario(),
                   usuarioRolDTO.getId_rol())) {
               throw new InsertException("El usuario ya tiene asignado este rol",
                       UsuariosRoleEntity.class.getName());
           }

           // buscamos al usuario en la bd
           UsuarioEntity usuario = usuarioRepository.findById(usuarioRolDTO.getId_usuario()).orElseThrow(() -> new InsertException("Usuario no encontrado en la DB", UsuarioEntity.class.getName()));

           //buscamos el rol en la bd
           RoleEntity rol = rolRepository.findById(usuarioRolDTO.getId_rol()).orElseThrow(() -> new InsertException("Rol no encontrado", RoleEntity.class.getName()));

           //ASIGNAR EL ROL AL USUARIO
           UsuariosRoleEntity usuarioRolToCreate = new UsuariosRoleEntity();
           usuarioRolToCreate.setId(compositeId);
           usuarioRolToCreate.setRol(rol);
           usuarioRolToCreate.setUsuario(usuario);

           //usuarioRolRepository.save(usuarioRolToCreate);
           // Save and flush to ensure immediate persistence
           usuarioRolRepository.save(usuarioRolToCreate);

       } catch(InsertException exception){
           throw exception; // Re-lanzar la excepción si el vendedor no se encuentra
       } catch(Exception exception){
           this.msgError = this.msgError == null ? "Error to match user and rol" : this.msgError;
           throw new InsertException(this.msgError, AutoEntity.class.getName());
       }
    }


    // UPDATE - Actualizar rol a un usuario
    public void update(Integer userId, UsuarioRolDTO usuarioRolDTO) throws Exception {
        try {
            // Validate that the userIds match
            if (!userId.equals(usuarioRolDTO.getId_usuario())) {
                throw new Exception("El ID de usuario en la ruta no coincide con el ID en el cuerpo de la solicitud");
            }

            // Find current role(s) for user
            List<UsuariosRoleEntity> currentRoles = usuarioRolRepository.findByUsuarioId(userId);
            if (currentRoles.isEmpty()) {
                throw new Exception("El usuario no tiene roles asignados");
            }

            // Check if new role assignment already exists
            if (usuarioRolRepository.existsByUsuarioIdAndRolId(userId, usuarioRolDTO.getId_rol())) {
                throw new Exception("El usuario ya tiene asignado este rol");
            }

            // Validate that the new role exists
            RoleEntity newRole = rolRepository.findById(usuarioRolDTO.getId_rol())
                    .orElseThrow(() -> new Exception("El nuevo rol no existe"));

            // Delete all current roles
            for (UsuariosRoleEntity currentRole : currentRoles) {
                usuarioRolRepository.delete(currentRole);
            }

            // Create new role assignment
            UsuariosRoleEntityId newCompositeId = new UsuariosRoleEntityId(userId, usuarioRolDTO.getId_rol());
            UsuariosRoleEntity newUserRole = new UsuariosRoleEntity();
            newUserRole.setId(newCompositeId);
            newUserRole.setUsuario(currentRoles.get(0).getUsuario()); // Use existing user reference
            newUserRole.setRol(newRole);

            usuarioRolRepository.save(newUserRole);

        } catch (Exception exception) {
            this.msgError = "Error al actualizar el rol del usuario: " + exception.getMessage();
            throw new Exception(this.msgError);
        }
    }

    // DELETE - Eliminar el rol al usuario
    public void delete(Integer usuarioId, Integer rolId) throws Exception {
        try {
            UsuariosRoleEntityId compositeId = new UsuariosRoleEntityId(usuarioId, rolId);

            if (!usuarioRolRepository.existsById(compositeId)) {
                throw new Exception("La relación usuario-rol no existe");
            }

            usuarioRolRepository.deleteById(compositeId);

        } catch (Exception exception) {
            this.msgError = "Error al eliminar el rol del usuario: " + exception.getMessage();
            throw new Exception(this.msgError);
        }
    }

    // GET - Obtener todos los usuarios con sus roles
    public List<Map<String, Object>> getAllUsuariosRoles() {
        try {
            List<UsuariosRoleEntity> usuariosRoles = usuarioRolRepository.findAll();
            return usuariosRoles.stream().map(ur -> {
                Map<String, Object> userRole = new HashMap<>();
                userRole.put("usuario_id", ur.getUsuario().getId());
                userRole.put("usuario_nombre", ur.getUsuario().getNombre());
                userRole.put("rol_id", ur.getRol().getId());
                userRole.put("rol_nombre", ur.getRol().getNombre());
                return userRole;
            }).collect(Collectors.toList());
        } catch (Exception exception) {
            logger.error("Error fetching usuarios roles", exception);
            throw new RuntimeException("Error al obtener los usuarios y roles");
        }
    }

    // ASIGNAR ROL A UN USUARIO
    public void assignNewRoleToUser(Integer userId, Integer roleId) throws InsertException {
        try {
            // Validar si el usuario ya tiene el rol asignado
            if (usuarioRolRepository.existsByUsuarioIdAndRolId(userId, roleId)) {
                throw new InsertException("El usuario ya tiene asignado el rol de vendedor", UsuariosRoleEntity.class.getName());
            }

            // Buscar usuario en la BD
            UsuarioEntity usuario = usuarioRepository.findById(userId)
                    .orElseThrow(() -> new InsertException("Usuario no encontrado en la DB", UsuarioEntity.class.getName()));

            // Buscar el rol "vendedor" en la BD
            RoleEntity rol = rolRepository.findById(roleId)
                    .orElseThrow(() -> new InsertException("Rol no encontrado", RoleEntity.class.getName()));

            // Crear la relación usuario-rol
            UsuariosRoleEntityId compositeId = new UsuariosRoleEntityId(userId, roleId);
            UsuariosRoleEntity usuarioRol = new UsuariosRoleEntity();
            usuarioRol.setId(compositeId);
            usuarioRol.setUsuario(usuario);
            usuarioRol.setRol(rol);

            // Guardar en la BD
            usuarioRolRepository.save(usuarioRol);

        } catch (InsertException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new InsertException("Error al asignar el rol de vendedor", UsuariosRoleEntity.class.getName());
        }
    }

}

