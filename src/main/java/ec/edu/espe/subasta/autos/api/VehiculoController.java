package ec.edu.espe.subasta.autos.api;


import ec.edu.espe.subasta.autos.api.DTO.VehiculoDTO;
import ec.edu.espe.subasta.autos.exception.InsertException;
import ec.edu.espe.subasta.autos.service.VehiculoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/vehiculo")
public class VehiculoController {
    private final VehiculoService vehiculoService;

    private static final Logger logger = LoggerFactory.getLogger(VehiculoController.class);

    public VehiculoController(VehiculoService vehiculoService) {
        this.vehiculoService = vehiculoService;
    }

    @PostMapping("/createVehiculo")
    public ResponseEntity<?> createVehiculo(@RequestBody VehiculoDTO vehiculoDTO) {
        try {
            vehiculoService.create(vehiculoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (InsertException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
