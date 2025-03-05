package ec.edu.espe.subasta.autos.api;


import ec.edu.espe.subasta.autos.api.DTO.AutoDTO;
import ec.edu.espe.subasta.autos.exception.DeleteException;
import ec.edu.espe.subasta.autos.exception.DocumentNotFoundException;
import ec.edu.espe.subasta.autos.exception.InsertException;
import ec.edu.espe.subasta.autos.service.AutoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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

    //PERMITIR A VENDEDORES, COMPRADORES Y ADMINISTRADORES CREAR VEHICULOS
    @PreAuthorize("hasAnyAuthority('ROLE_ADMINISTRADOR', 'ROLE_VENDEDOR', 'ROLE_COMPRADOR')")
    @PostMapping("/create")
    public ResponseEntity<?> createVehiculo(@RequestBody AutoDTO autoDTO) {
        try {
            autoService.create(autoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Vehículo creado exitosamente"));
        } catch (InsertException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMINISTRADOR', 'ROLE_VENDEDOR', 'ROLE_COMPRADOR')")
    //update vehicle seller
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateVehicle(@RequestBody AutoDTO autoDTO) {
        try {
            this.autoService.update(autoDTO);
            return ResponseEntity.ok().body("Vehículo actualizado exitosamente");
        } catch (DocumentNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el vehículo: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMINISTRADOR')")
    // Admin endpoints
    @GetMapping("/getAllVehicles")
    public ResponseEntity<List<AutoDTO>> getAllVehicles() {
        return ResponseEntity.ok(autoService.getAllVehicles());
    }


    // Delete vehicle
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteVehicle(AutoDTO autoDTO) throws DeleteException {
        autoService.delete(autoDTO);
        return ResponseEntity.ok().build();
    }

    // Get all by seller
    @GetMapping("/getAll/{vendedorId}")
    public ResponseEntity<List<AutoDTO>> getVehiclesByVendedor(@PathVariable Long vendedorId) {
        return ResponseEntity.ok(autoService.getVehiclesByVendedor(vendedorId));
    }

    // Buyer endpoints, for know what car its available
    @GetMapping("/available")
    public ResponseEntity<List<AutoDTO>> getAvailableVehicles() {
        return ResponseEntity.ok(autoService.getAvailableVehicles());
    }

    // Common endpoints
    @GetMapping("/{id}")
    public ResponseEntity<AutoDTO> getVehicleById(@PathVariable Integer id) throws DocumentNotFoundException {
        return ResponseEntity.ok(autoService.getVehicleById(id));
    }

    @PutMapping("/asignar/{autoId}/comprador/{compradorId}")
    public ResponseEntity<?> asignarAutoToComprador(
            @PathVariable Integer autoId,
            @PathVariable Integer compradorId) {
        try {
            autoService.asignarAutoToComprador(autoId, compradorId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
