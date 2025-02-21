package ec.edu.espe.subasta.autos.repository;

import ec.edu.espe.subasta.autos.entity.AutoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.List;

public interface AutoRepository extends JpaRepository<AutoEntity, Integer>{
    AutoEntity findByMarca(String marca);
    // Metodo para obtener todos los autos de un vendedor específico
    List<AutoEntity> findByVendedorId(Long vendedorId);
}
