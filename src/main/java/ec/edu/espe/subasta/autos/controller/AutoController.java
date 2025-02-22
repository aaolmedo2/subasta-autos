package ec.edu.espe.subasta.autos.controller;

import ec.edu.espe.subasta.autos.api.DTO.AutoDTO;
import ec.edu.espe.subasta.autos.exception.DeleteException;
import ec.edu.espe.subasta.autos.exception.DocumentNotFoundException;
import ec.edu.espe.subasta.autos.exception.InsertException;
import ec.edu.espe.subasta.autos.exception.UpdateException;
import ec.edu.espe.subasta.autos.service.AutoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/autos")
public class AutoController {

    private final AutoService autoService;

    public AutoController(AutoService autoService) {
        this.autoService = autoService;
    }

    // Admin endpoints
    @GetMapping("/admin/all")
    public ResponseEntity<List<AutoDTO>> getAllVehicles() {
        return ResponseEntity.ok(autoService.getAllVehicles());
    }

    // Seller endpoints
    @PostMapping("/seller/create")
    public ResponseEntity<Void> createVehicle(@RequestBody AutoDTO autoDTO) throws InsertException {
        autoService.create(autoDTO);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/seller/update")
    public ResponseEntity<Void> updateVehicle(@RequestBody AutoDTO autoDTO) throws UpdateException {
        autoService.update(autoDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/seller/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Integer id) throws DeleteException {
        autoService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/seller/{vendedorId}")
    public ResponseEntity<List<AutoDTO>> getVehiclesByVendedor(@PathVariable Long vendedorId) {
        return ResponseEntity.ok(autoService.getVehiclesByVendedor(vendedorId));
    }

    // Buyer endpoints
    @GetMapping("/available")
    public ResponseEntity<List<AutoDTO>> getAvailableVehicles() {
        return ResponseEntity.ok(autoService.getAvailableVehicles());
    }

    // Common endpoints
    @GetMapping("/{id}")
    public ResponseEntity<AutoDTO> getVehicleById(@PathVariable Integer id) throws DocumentNotFoundException {
        return ResponseEntity.ok(autoService.getVehicleById(id));
    }
}