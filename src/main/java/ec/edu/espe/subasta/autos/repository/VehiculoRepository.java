package ec.edu.espe.subasta.autos.repository;

import ec.edu.espe.subasta.autos.entity.VehiculoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehiculoRepository extends JpaRepository<VehiculoEntity, Integer>{
    VehiculoEntity findByMarca(String marca);
}
