package ec.edu.espe.subasta.autos.api;


import ec.edu.espe.subasta.autos.api.DTO.AutoDTO;
import ec.edu.espe.subasta.autos.exception.InsertException;
import ec.edu.espe.subasta.autos.service.AutoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/vehiculo")
public class AutoController {
    private final AutoService autoService;

    private static final Logger logger = LoggerFactory.getLogger(AutoController.class);

    public AutoController(AutoService autoService) {
        this.autoService = autoService;
    }

    @PostMapping("/createVehiculo")
    public ResponseEntity<?> createVehiculo(@RequestBody AutoDTO autoDTO) {
        try {
            autoService.create(autoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Vehículo creado exitosamente"));
        } catch (InsertException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
