package ec.edu.espe.subasta.autos.repository;

import ec.edu.espe.subasta.autos.entity.AutoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AutoRepository extends JpaRepository<AutoEntity, Integer> {
    AutoEntity findByMarca(String marca);
    // Metodo para obtener todos los autos de un vendedor específico
    List<AutoEntity> findByVendedorId(Long vendedorId);
    List<AutoEntity> findByVendido(Boolean vendido);

    @Modifying
    @Query("UPDATE AutoEntity a SET a.vendedor.id = :compradorId WHERE a.id = :autoId")
    void asignarAutoToComprador(@Param("autoId") Integer autoId, @Param("compradorId") Integer compradorId);
}
