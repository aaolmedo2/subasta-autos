package ec.edu.espe.subasta.autos.service;

import ec.edu.espe.subasta.autos.api.DTO.PujaDTO;
import ec.edu.espe.subasta.autos.entity.PujaEntity;
import ec.edu.espe.subasta.autos.entity.SubastaEntity;
import ec.edu.espe.subasta.autos.entity.UsuarioEntity;
import ec.edu.espe.subasta.autos.repository.PujaRepository;
import ec.edu.espe.subasta.autos.repository.SubastaRepository;
import ec.edu.espe.subasta.autos.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PujaService {
    private final PujaRepository pujaRepository;
    private final SubastaRepository subastaRepository;
    private final UsuarioRepository usuarioRepository;

    public PujaService(PujaRepository pujaRepository, 
                      SubastaRepository subastaRepository,
                      UsuarioRepository usuarioRepository) {
        this.pujaRepository = pujaRepository;
        this.subastaRepository = subastaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public PujaDTO realizarPuja(PujaDTO pujaDTO) {
        // Validar que la subasta existe y está activa
        SubastaEntity subasta = subastaRepository.findById(pujaDTO.getSubastaId())
                .orElseThrow(() -> new RuntimeException("Subasta no encontrada"));

        if (!subasta.getActiva()) {
            throw new RuntimeException("La subasta no está activa");
        }

        // Validar que el comprador existe
        UsuarioEntity comprador = usuarioRepository.findById(pujaDTO.getCompradorId())
                .orElseThrow(() -> new RuntimeException("Comprador no encontrado"));

        // Validar que el comprador no es el vendedor
        if (comprador.getId().equals(subasta.getAuto().getVendedor().getId())) {
            throw new RuntimeException("No puedes pujar por tu propio auto");
        }

        // Validar que la puja es mayor que el precio mínimo
        if (pujaDTO.getMonto() < subasta.getPrecioMinimo()) {
            throw new RuntimeException("La puja debe ser mayor al precio mínimo");
        }

        // Validar que la puja es mayor que la última puja
        Float ultimaPuja = pujaRepository.findMaxMontoBySubastaId(pujaDTO.getSubastaId());
        if (ultimaPuja != null && pujaDTO.getMonto() <= ultimaPuja) {
            throw new RuntimeException("La puja debe ser mayor a la última puja");
        }

        PujaEntity puja = new PujaEntity();
        puja.setSubasta(subasta);
        puja.setComprador(comprador);
        puja.setMonto(pujaDTO.getMonto());
        puja.setFechaPuja(LocalDate.now());

        return convertToDTO(pujaRepository.save(puja));
    }

    private PujaDTO convertToDTO(PujaEntity entity) {
        PujaDTO dto = new PujaDTO();
        dto.setSubastaId(entity.getSubasta().getId());
        dto.setCompradorId(entity.getComprador().getId());
        dto.setMonto(entity.getMonto());
        dto.setFechaPuja(entity.getFechaPuja());
        return dto;
    }

    public List<PujaDTO> obtenerPujasDeSubasta(Integer subastaId) {
        List<PujaEntity> pujas = pujaRepository.obtenerPujasDeSubasta(subastaId);
        return pujas.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private void validarPuja(PujaDTO pujaDTO, SubastaEntity subasta, UsuarioEntity comprador) {
        // Validar que la subasta está dentro del período válido
        LocalDate fechaActual = LocalDate.now();
        if (fechaActual.isBefore(subasta.getFechaInicio()) || 
            fechaActual.isAfter(subasta.getFechaFin())) {
            throw new RuntimeException("La subasta no está en su período válido");
        }

        // Validar que el comprador está activo
        if (!comprador.getActivo()) {
            throw new RuntimeException("El comprador no está activo en el sistema");
        }

        // Validar que el comprador tiene el rol adecuado (esto requeriría acceso al servicio de roles)
        // Implementar según tu lógica de roles

        // Las demás validaciones ya están en el método realizarPuja
    }
} 