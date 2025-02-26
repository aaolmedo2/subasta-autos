package ec.edu.espe.subasta.autos.repository;

import ec.edu.espe.subasta.autos.entity.SubastaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface SubastaRepository extends JpaRepository<SubastaEntity, Integer> {
    boolean existsByAutoIdAndActivaTrue(Integer autoId);
    List<SubastaEntity> findByActivaTrue();
    
    @Query("SELECT s FROM SubastaEntity s WHERE s.activa = true AND s.fechaFin < :fechaActual")
    List<SubastaEntity> findSubastasVencidas(@Param("fechaActual") LocalDate fechaActual);
    
    @Query("SELECT COUNT(s) > 0 FROM SubastaEntity s WHERE s.auto.id = :autoId AND s.activa = true")
    boolean tieneSubastaActiva(@Param("autoId") Integer autoId);
}
