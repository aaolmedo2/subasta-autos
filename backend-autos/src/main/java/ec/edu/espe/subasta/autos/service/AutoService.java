package ec.edu.espe.subasta.autos.service;

import ec.edu.espe.subasta.autos.api.DTO.AutoDTO;
import ec.edu.espe.subasta.autos.entity.AutoEntity;
import ec.edu.espe.subasta.autos.entity.UsuarioEntity;
import ec.edu.espe.subasta.autos.exception.DeleteException;
import ec.edu.espe.subasta.autos.exception.DocumentNotFoundException;
import ec.edu.espe.subasta.autos.exception.InsertException;
import ec.edu.espe.subasta.autos.repository.UsuarioRepository;
import ec.edu.espe.subasta.autos.repository.AutoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
            vehiculoToCreate.setFechaCreacion(LocalDate.now());

            // Guardar el vehículo en la base de datos
            autoRepository.save(vehiculoToCreate);

        } catch(InsertException exception){
            throw exception; // Re-lanzar la excepción si el vendedor no se encuentra
        } catch(Exception exception){
            this.msgError = this.msgError == null ? "Error creating new vehicle" : this.msgError;
            throw new InsertException(this.msgError, AutoEntity.class.getName());
        }
    }

    //update vehicle (regular update - no id_vendedor change)
    public void update(AutoDTO autoDTO) throws Exception {
        try {
            // Find the vehicle
            AutoEntity existingAuto = this.autoRepository.findById(autoDTO.getId())
                    .orElseThrow(() -> new DocumentNotFoundException("Auto no encontrado", AutoEntity.class.getName()));

            // Validate the new data
            validateAutoData(autoDTO);

            // Update fields (excluding id_vendedor)

            existingAuto.setId(autoDTO.getId());

            existingAuto.setMarca(autoDTO.getMarca());
            existingAuto.setModelo(autoDTO.getModelo());
            existingAuto.setAnio(autoDTO.getAnio());
            existingAuto.setPrecioBase(autoDTO.getPrecio_base());
            existingAuto.setVendido(autoDTO.isEstado());
            //existingAuto.setFechaCreacion(autoDTO.getFecha());

            // Save the updated vehicle
            this.autoRepository.save(existingAuto);

        } catch (DocumentNotFoundException exception) {
            throw exception;
        } catch (Exception exception) {
            this.msgError = this.msgError == null ? "Error updating vehicle" : this.msgError;
            throw new Exception(this.msgError);
        }
    }

    //delete vehicle
    public void delete(AutoDTO autoDTO) throws DeleteException {
        try {
            Optional<AutoEntity> autoEntityOptional = this.autoRepository.findById(autoDTO.getId());

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
            return autoEntities.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching all vehicles", e);
            throw new RuntimeException("Error al obtener los autos", e);
        }
    }

    // New method for buyers to see available (unsold) vehicles
    public List<AutoDTO> getAvailableVehicles() {
        try {
            List<AutoEntity> availableAutos = this.autoRepository.findByVendido(false);
            return availableAutos.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching available vehicles", e);
            throw new RuntimeException("Error al obtener los autos disponibles", e);
        }
    }

    // New method to get vehicle details
    public AutoDTO getVehicleById(Integer id) throws DocumentNotFoundException {
        try {
            AutoEntity auto = this.autoRepository.findById(id)
                    .orElseThrow(() -> new DocumentNotFoundException("Auto no encontrado", AutoEntity.class.getName()));
            return convertToDTO(auto);
        } catch (Exception e) {
            logger.error("Error fetching vehicle by id: {}", id, e);
            throw new RuntimeException("Error al obtener el auto", e);
        }
    }

    // Helper method to convert Entity to DTO
    private AutoDTO convertToDTO(AutoEntity autoEntity) {
        AutoDTO autoDTO = new AutoDTO();
        autoDTO.setId_vendedor(autoEntity.getVendedor().getId());
        autoDTO.setMarca(autoEntity.getMarca());
        autoDTO.setModelo(autoEntity.getModelo());
        autoDTO.setAnio(autoEntity.getAnio());
        autoDTO.setPrecio_base(autoEntity.getPrecioBase());
        autoDTO.setEstado(autoEntity.getVendido());
        autoDTO.setFecha(autoEntity.getFechaCreacion());
        return autoDTO;
    }

    // Helper method to validate auto data
    private void validateAutoData(AutoDTO autoDTO) throws InsertException {
        if (autoDTO.getMarca() == null || autoDTO.getMarca().trim().isEmpty()) {
            throw new InsertException("La marca es requerida", AutoEntity.class.getName());
        }
        if (autoDTO.getModelo() == null || autoDTO.getModelo().trim().isEmpty()) {
            throw new InsertException("El modelo es requerido", AutoEntity.class.getName());
        }
        if (autoDTO.getAnio() == null || autoDTO.getAnio() < 1900) {
            throw new InsertException("Año inválido", AutoEntity.class.getName());
        }
        if (autoDTO.getPrecio_base() == null || autoDTO.getPrecio_base().intValue() <= 0 ) {
            throw new InsertException("Precio base inválido", AutoEntity.class.getName());
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

                        autoDTO.setId(autoEntity.getId());
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
