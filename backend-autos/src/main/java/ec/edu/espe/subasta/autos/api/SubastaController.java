package ec.edu.espe.subasta.autos.api;

import ec.edu.espe.subasta.autos.api.DTO.SubastaDTO;
import ec.edu.espe.subasta.autos.service.SubastaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subasta")
@CrossOrigin(maxAge = 3600)
public class SubastaController {
    private final SubastaService subastaService;

    public SubastaController(SubastaService subastaService) {
        this.subastaService = subastaService;
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearSubasta(@RequestBody SubastaDTO subastaDTO) {
        try {
            return ResponseEntity.ok(subastaService.crearSubasta(subastaDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/activas")
    public ResponseEntity<?> obtenerSubastasActivas() {
        return ResponseEntity.ok(subastaService.obtenerSubastasActivas());
    }

    @GetMapping("/activasMine/{vendedorId}")
    public ResponseEntity<?> obtenerSubastasActivasMine(@PathVariable Long vendedorId) {
        return ResponseEntity.ok(subastaService.obtenerSubastasActivasMine(vendedorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerSubasta(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(subastaService.obtenerSubasta(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/finalizar")
    public ResponseEntity<?> finalizarSubasta(@PathVariable Integer id) {
        try {
            subastaService.finalizarSubasta(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 