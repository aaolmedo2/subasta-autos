package ec.edu.espe.subasta.autos.service;

import ec.edu.espe.subasta.autos.api.DTO.SubastaDTO;
import ec.edu.espe.subasta.autos.api.DTO.SubastaDTOc;
import ec.edu.espe.subasta.autos.entity.AutoEntity;
import ec.edu.espe.subasta.autos.entity.PujaEntity;
import ec.edu.espe.subasta.autos.entity.SubastaEntity;
import ec.edu.espe.subasta.autos.repository.AutoRepository;
import ec.edu.espe.subasta.autos.repository.PujaRepository;
import ec.edu.espe.subasta.autos.repository.SubastaRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubastaService {
    private final SubastaRepository subastaRepository;
    private final AutoRepository autoRepository;
    private final PujaRepository pujaRepository;

    public SubastaService(SubastaRepository subastaRepository, AutoRepository autoRepository, PujaRepository pujaRepository) {
        this.subastaRepository = subastaRepository;
        this.autoRepository = autoRepository;
        this.pujaRepository = pujaRepository;
    }

    @Transactional
    public SubastaDTO crearSubasta(SubastaDTO subastaDTO) {
        // Validar que el auto existe y no está vendido
        AutoEntity auto = autoRepository.findById(subastaDTO.getAutoId())
                .orElseThrow(() -> new RuntimeException("Auto no encontrado"));

        if (auto.getVendido()) {
            throw new RuntimeException("El auto ya está vendido");
        }

        // Validar que no exista una subasta activa para este auto
        if (subastaRepository.existsByAutoIdAndActivaTrue(subastaDTO.getAutoId())) {
            throw new RuntimeException("Ya existe una subasta activa para este auto");
        }

        SubastaEntity subasta = new SubastaEntity();
        subasta.setAuto(auto);
        subasta.setFechaInicio(subastaDTO.getFechaInicio());
        subasta.setFechaFin(subastaDTO.getFechaFin());
        subasta.setPrecioMinimo(subastaDTO.getPrecioMinimo());
        subasta.setActiva(true);

        return convertToDTO(subastaRepository.save(subasta));
    }

    public List<SubastaDTOc> obtenerSubastasActivas() {
        return subastaRepository.findByActivaTrue()
                .stream()
                .map(this::convertToDTOc)
                .collect(Collectors.toList());
    }

    public List<SubastaDTO> obtenerSubastasActivasMine(Long vendedorId) {
        try {
            // Obtener las subastas activas del vendedor desde el repositorio
            List<SubastaEntity> subastasActivas = subastaRepository.findSubastasActivasByVendedorId(vendedorId);

            // Convertir las entidades a DTOs
            return subastasActivas.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener las subastas del vendedor", e);
        }
    }

    public SubastaDTO obtenerSubasta(Integer id) {
        SubastaEntity subasta = subastaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subasta no encontrada"));
        return convertToDTO(subasta);
    }

    @Transactional
    public void finalizarSubasta(Integer id) {
        SubastaEntity subasta = subastaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subasta no encontrada"));

        if (!subasta.getActiva()) {
            throw new RuntimeException("La subasta ya está finalizada");
        }

        // Obtener la puja más alta
        Float maximaPuja = pujaRepository.findMaxMontoBySubastaId(id);
        if (maximaPuja != null) {
            List<PujaEntity> pujas = pujaRepository.findBySubastaIdOrderByMontoDesc(id);
            if (!pujas.isEmpty()) {
                PujaEntity pujaGanadora = pujas.get(0);
                subasta.setGanador(pujaGanadora.getComprador());
                
                // Marcar el auto como vendido
                AutoEntity auto = subasta.getAuto();
                auto.setVendido(true);
                autoRepository.save(auto);
            }
        }

        subasta.setActiva(false);
        subastaRepository.save(subasta);
    }

    @Scheduled(cron = "0 0 * * * *") // Ejecutar cada hora
    public void finalizarSubastasVencidas() {
        List<SubastaEntity> subastasVencidas = subastaRepository.findSubastasVencidas(LocalDate.now());
        for (SubastaEntity subasta : subastasVencidas) {
            try {
                finalizarSubasta(subasta.getId());
            } catch (Exception e) {
                // Manejar la excepción o registrar el error
            }
        }
    }

    private SubastaDTO convertToDTO(SubastaEntity entity) {
        SubastaDTO dto = new SubastaDTO();
        dto.setAutoId(entity.getAuto().getId());
        dto.setFechaInicio(entity.getFechaInicio());
        dto.setFechaFin(entity.getFechaFin());
        dto.setPrecioMinimo(entity.getPrecioMinimo());
        dto.setActiva(entity.getActiva());
        if (entity.getGanador() != null) {
            dto.setGanadorId(entity.getGanador().getId());
        }
        return dto;
    }

    private SubastaDTOc convertToDTOc(SubastaEntity entity) {
        SubastaDTOc dto = new SubastaDTOc();
        dto.setId(entity.getId());
        dto.setAutoId(entity.getAuto().getId());
        dto.setFechaInicio(entity.getFechaInicio());
        dto.setFechaFin(entity.getFechaFin());
        dto.setPrecioMinimo(entity.getPrecioMinimo());
        dto.setActiva(entity.getActiva());
        if (entity.getGanador() != null) {
            dto.setGanadorId(entity.getGanador().getId());
        }
        return dto;
    }

} 