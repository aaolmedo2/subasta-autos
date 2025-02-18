package ec.edu.espe.subasta.autos.service;

import ec.edu.espe.subasta.autos.api.DTO.EstadoVehiculo;
import ec.edu.espe.subasta.autos.api.DTO.VehiculoDTO;
import ec.edu.espe.subasta.autos.entity.UsuarioEntity;
import ec.edu.espe.subasta.autos.entity.VehiculoEntity;
import ec.edu.espe.subasta.autos.exception.InsertException;
import ec.edu.espe.subasta.autos.repository.UsuarioRepository;
import ec.edu.espe.subasta.autos.repository.VehiculoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class VehiculoService {

    private final VehiculoRepository vehiculoRepository;

    private final UsuarioRepository usuarioRepository;

    private static final Logger logger = LoggerFactory.getLogger(VehiculoService.class);

    private String msgError;

    public VehiculoService(VehiculoRepository vehiculoRepository, UsuarioRepository usuarioRepository) {
        this.vehiculoRepository = vehiculoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    //crear vehiculo
    public void create(VehiculoDTO vehiculoDTO) throws InsertException {
        try {
            // Validar el estado
            if (vehiculoDTO.getEstado() == null || !isEstadoValido(vehiculoDTO.getEstado())) {
                throw new InsertException("Estado no válido. Los estados permitidos son: DISPONIBLE, EN_SUBASTA, VENDIDO", VehiculoEntity.class.getName());}

                // Buscar el vendedor en la base de datos
                UsuarioEntity vendedor = usuarioRepository.findById(vehiculoDTO.getId_vendedor())
                        .orElseThrow(() -> new InsertException("Vendedor no encontrado", UsuarioEntity.class.getName()));

                // Crear el vehículo y asignar el vendedor
                VehiculoEntity vehiculoToCreate = new VehiculoEntity();
                vehiculoToCreate.setVendedor(vendedor);
                vehiculoToCreate.setMarca(vehiculoDTO.getMarca());
                vehiculoToCreate.setModelo(vehiculoDTO.getModelo());
                vehiculoToCreate.setAnio(vehiculoDTO.getAnio());
                vehiculoToCreate.setPrecioBase(vehiculoDTO.getPrecio_base());
                //vehiculoToCreate.setEstado(vehiculoDTO.getEstado());

                //Convertir el enum a String antes de asignarlo
                vehiculoToCreate.setEstado(vehiculoDTO.getEstado().toString());

                // Guardar el vehículo en la base de datos
                vehiculoRepository.save(vehiculoToCreate);

        } catch(InsertException exception){
            throw exception; // Re-lanzar la excepción si el vendedor no se encuentra
        } catch(Exception exception){
            this.msgError = this.msgError == null ? "Error creating new vehicle" : this.msgError;
            throw new InsertException(this.msgError, VehiculoEntity.class.getName());
        }
    }
    // Metodo para validar el estado
    private boolean isEstadoValido (EstadoVehiculo estado){
        return estado != null && Arrays.asList(EstadoVehiculo.values()).contains(estado);
    }
}
