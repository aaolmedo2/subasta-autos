package ec.edu.espe.subasta.autos.service;

import ec.edu.espe.subasta.autos.api.DTO.AutoDTO;
import ec.edu.espe.subasta.autos.entity.AutoEntity;
import ec.edu.espe.subasta.autos.entity.UsuarioEntity;
import ec.edu.espe.subasta.autos.exception.InsertException;
import ec.edu.espe.subasta.autos.repository.UsuarioRepository;
import ec.edu.espe.subasta.autos.repository.AutoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Arrays;

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

}
