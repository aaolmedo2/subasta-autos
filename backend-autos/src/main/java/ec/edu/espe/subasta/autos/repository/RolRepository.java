package ec.edu.espe.subasta.autos.repository;

import ec.edu.espe.subasta.autos.entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Set;

public interface RolRepository extends JpaRepository<RoleEntity, Integer> {
   // Set<RoleEntity> findByRol(String rol);
   Optional<RoleEntity> findByNombre(String nombre);
}
