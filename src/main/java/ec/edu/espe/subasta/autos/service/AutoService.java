package ec.edu.espe.subasta.autos.service;

import ec.edu.espe.subasta.autos.api.DTO.AutoDTO;
import ec.edu.espe.subasta.autos.entity.AutoEntity;
import ec.edu.espe.subasta.autos.entity.UsuarioEntity;
import ec.edu.espe.subasta.autos.exception.DeleteException;
import ec.edu.espe.subasta.autos.exception.DocumentNotFoundException;
import ec.edu.espe.subasta.autos.exception.InsertException;
import ec.edu.espe.subasta.autos.exception.UpdateException;
import ec.edu.espe.subasta.autos.repository.UsuarioRepository;
import ec.edu.espe.subasta.autos.repository.AutoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AutoService {

    private final AutoRepository autoRepository;

    private final UsuarioRepository usuarioRepository;

    private static final Logger logger = LoggerFactory.getLogger(AutoService.class);

    private String msgError;

    public AutoService(AutoRepository autoRepository, UsuarioRepository usuarioRepository) {
        this.autoRepository = autoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    //crear vehiculo
    public void create(AutoDTO autoDTO) throws InsertException {
        try {

            // Buscar el vendedor en la base de datos
            UsuarioEntity vendedor = usuarioRepository.findById(autoDTO.getId_vendedor())
                    .orElseThrow(() -> new InsertException("Vendedor no encontrado", UsuarioEntity.class.getName()));

            // Crear el vehículo y asignar el vendedor
            AutoEntity vehiculoToCreate = new AutoEntity();
            vehiculoToCreate.setVendedor(vendedor);
            vehiculoToCreate.setMarca(autoDTO.getMarca());
            vehiculoToCreate.setModelo(autoDTO.getModelo());
            vehiculoToCreate.setAnio(autoDTO.getAnio());
            vehiculoToCreate.setPrecioBase(autoDTO.getPrecio_base());
            vehiculoToCreate.setVendido(autoDTO.isEstado());
            vehiculoToCreate.setFechaCreacion(autoDTO.getFecha());

            // Guardar el vehículo en la base de datos
            autoRepository.save(vehiculoToCreate);

        } catch(InsertException exception){
            throw exception; // Re-lanzar la excepción si el vendedor no se encuentra
        } catch(Exception exception){
            this.msgError = this.msgError == null ? "Error creating new vehicle" : this.msgError;
            throw new InsertException(this.msgError, AutoEntity.class.getName());
        }
    }

    //update auto
    public void update(AutoDTO autoDTO) throws UpdateException {
        try{
            Optional<AutoEntity> autoToUpdate = this.autoRepository.findById(autoDTO.getId());

            if (!autoToUpdate.isPresent()) {
                this.msgError = "Error al actualizar el vehiculo";
                throw new UpdateException(this.msgError, AutoEntity.class.getName());
            }

            // Validar que el id_vendedor no se pueda cambiar
            if (!autoToUpdate.get().getVendedor().getId().equals(autoDTO.getId_vendedor())) {
                this.msgError = "Error al actualizar el vehiculo: No puedes cambiar el vendedor";
                throw new UpdateException(this.msgError, AutoEntity.class.getName());
            }

            // Actualizar los campos permitidos
            autoToUpdate.get().setMarca(autoDTO.getMarca());
            autoToUpdate.get().setModelo(autoDTO.getModelo());
            autoToUpdate.get().setAnio(autoDTO.getAnio());
            autoToUpdate.get().setPrecioBase(autoDTO.getPrecio_base());
            autoToUpdate.get().setVendido(autoDTO.isEstado());
            autoToUpdate.get().setFechaCreacion(autoDTO.getFecha());

            autoRepository.save(autoToUpdate.get());

        } catch (Exception exception) {
            this.msgError = this.msgError == null ? "Error updating vehicle" : this.msgError;
            throw new UpdateException(this.msgError, AutoEntity.class.getName());
        }
    }


    public void delete(Integer id) throws DeleteException {
        try {
            Optional<AutoEntity> autoEntityOptional = this.autoRepository.findById(id);

            if (!autoEntityOptional.isPresent()) {
                this.msgError = "Auto doesn't exist";
                throw new DeleteException(this.msgError, AutoEntity.class.getName());
            }

            this.autoRepository.delete(autoEntityOptional.get());

        } catch (Exception exception) {
            this.msgError = this.msgError == null ? "Error deleting client" : this.msgError;
            throw new DeleteException(this.msgError, AutoEntity.class.getName());
        }
    }

    //obtener todos los autos para el admin
    public List<AutoDTO> getAllVehicles() {
        try {
            List<AutoEntity> autoEntities = this.autoRepository.findAll();

            // Convertir entidades a DTOs para hacer
            List<AutoDTO> autoDTOs = autoEntities.stream()
                    .map(autoEntity -> {

                        AutoDTO autoDTO = new AutoDTO();

                        autoDTO.setMarca(autoEntity.getMarca());
                        autoDTO.setModelo(autoEntity.getModelo());
                        autoDTO.setAnio(autoEntity.getAnio());
                        autoDTO.setPrecio_base(autoEntity.getPrecioBase());
                        autoDTO.setEstado(autoEntity.getVendido());
                        autoDTO.setFecha(autoEntity.getFechaCreacion());

                        return autoDTO;
                    })
                    .collect(Collectors.toList());

            return autoDTOs;

        } catch (Exception e) {
            throw new RuntimeException("Error al obtener los autos", e);
        }
    }

    // Obtener todos los autos de un vendedor específico
    public List<AutoDTO> getVehiclesByVendedor(Long vendedorId) {
        try {
            // Obtener los autos del vendedor desde el repositorio
            List<AutoEntity> autoEntities = this.autoRepository.findByVendedorId(vendedorId);

            // Convertir entidades a DTOs
            List<AutoDTO> autoDTOs = autoEntities.stream()
                    .map(autoEntity -> {
                        AutoDTO autoDTO = new AutoDTO();

                        autoDTO.setId(autoEntity.getId()); // Asegúrate de incluir el ID si es necesario
                        autoDTO.setMarca(autoEntity.getMarca());
                        autoDTO.setModelo(autoEntity.getModelo());
                        autoDTO.setAnio(autoEntity.getAnio());
                        autoDTO.setPrecio_base(autoEntity.getPrecioBase());
                        autoDTO.setEstado(autoEntity.getVendido());
                        autoDTO.setFecha(autoEntity.getFechaCreacion());

                        return autoDTO;
                    })
                    .collect(Collectors.toList());

            return autoDTOs;

        } catch (Exception e) {
            throw new RuntimeException("Error al obtener los autos del vendedor", e);
        }
    }


}
