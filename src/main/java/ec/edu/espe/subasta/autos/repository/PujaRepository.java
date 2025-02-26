package ec.edu.espe.subasta.autos.repository;

import ec.edu.espe.subasta.autos.entity.PujaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PujaRepository extends JpaRepository<PujaEntity, Integer> {
    List<PujaEntity> findBySubastaIdOrderByMontoDesc(Integer subastaId);
    
    @Query("SELECT MAX(p.monto) FROM PujaEntity p WHERE p.subasta.id = :subastaId")
    Float findMaxMontoBySubastaId(@Param("subastaId") Integer subastaId);
    
    @Query("SELECT p FROM PujaEntity p WHERE p.subasta.id = :subastaId ORDER BY p.monto DESC")
    List<PujaEntity> obtenerPujasDeSubasta(@Param("subastaId") Integer subastaId);
}
