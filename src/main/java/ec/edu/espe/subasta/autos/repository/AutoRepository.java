package ec.edu.espe.subasta.autos.repository;

import ec.edu.espe.subasta.autos.entity.AutoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AutoRepository extends JpaRepository<AutoEntity, Integer>{
    AutoEntity findByMarca(String marca);
}
