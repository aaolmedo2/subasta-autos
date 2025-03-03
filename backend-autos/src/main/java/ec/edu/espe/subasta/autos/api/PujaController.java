package ec.edu.espe.subasta.autos.api;

import ec.edu.espe.subasta.autos.api.DTO.PujaDTO;
import ec.edu.espe.subasta.autos.service.PujaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/puja")
@CrossOrigin(maxAge = 3600)
public class PujaController {
    private final PujaService pujaService;

    public PujaController(PujaService pujaService) {
        this.pujaService = pujaService;
    }

    @PreAuthorize("hasAnyAuthority('ROLE_COMPRADOR')")
    @PostMapping("/realizar")
    public ResponseEntity<?> realizarPuja(@RequestBody PujaDTO pujaDTO) {
        try {
            return ResponseEntity.ok(pujaService.realizarPuja(pujaDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/subasta/{subastaId}")
    public ResponseEntity<?> obtenerPujasDeSubasta(@PathVariable Integer subastaId) {
        return ResponseEntity.ok(pujaService.obtenerPujasDeSubasta(subastaId));
    }
} 