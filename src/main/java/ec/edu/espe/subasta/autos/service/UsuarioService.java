package ec.edu.espe.subasta.autos.service;

import ec.edu.espe.subasta.autos.api.DTO.AutoDTO;
import ec.edu.espe.subasta.autos.api.DTO.UsuarioDTO;
import ec.edu.espe.subasta.autos.entity.AutoEntity;
import ec.edu.espe.subasta.autos.entity.UsuarioEntity;
import ec.edu.espe.subasta.autos.exception.DeleteException;
import ec.edu.espe.subasta.autos.exception.DocumentNotFoundException;
import ec.edu.espe.subasta.autos.exception.InsertException;
import ec.edu.espe.subasta.autos.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    private String msgError;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
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

}
