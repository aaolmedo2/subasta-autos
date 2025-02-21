package ec.edu.espe.subasta.autos.api;


import ec.edu.espe.subasta.autos.api.DTO.AutoDTO;
import ec.edu.espe.subasta.autos.entity.AutoEntity;
import ec.edu.espe.subasta.autos.exception.DeleteException;
import ec.edu.espe.subasta.autos.exception.DocumentNotFoundException;
import ec.edu.espe.subasta.autos.exception.InsertException;
import ec.edu.espe.subasta.autos.exception.UpdateException;
import ec.edu.espe.subasta.autos.service.AutoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
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

    @DeleteMapping("/deleteVehiculo")
    public ResponseEntity delete(@RequestParam("id") Integer id) {
        try {
            this.autoService.delete(id);
            return ResponseEntity.ok().body("Correct delete vehicle");
        } catch (DeleteException deleteException) {
            return ResponseEntity.badRequest().body(deleteException.getMessage());
        }
    }

    @PatchMapping("/updateVehiculo")
    public ResponseEntity update(@RequestBody AutoDTO autoDTO) {
        try {
            this.autoService.update(autoDTO);
            return ResponseEntity.ok().body("Correct update vehicle");
        } catch (UpdateException updateException) {
            return ResponseEntity.badRequest().body(updateException.getMessage());
        }
    }

    @GetMapping("/allVehicles")
    public ResponseEntity<List<AutoDTO>> getAllVehicles() {
        try {
            List<AutoDTO> autos = this.autoService.getAllVehicles();
            return ResponseEntity.ok(autos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // Endpoint para obtener todos los autos de un vendedor
    @GetMapping("/vendedor/{vendedorId}")
    public ResponseEntity<?> getAutosByVendedor(@PathVariable Long vendedorId) {
        try {
            List<AutoDTO> autos = autoService.getVehiclesByVendedor(vendedorId);
            return ResponseEntity.ok(autos); // Devuelve la lista de autos con código 200 (OK)
        } catch (Exception e) {
            // Manejo de excepciones
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener los autos del vendedor: " + e.getMessage());
        }
    }
}
