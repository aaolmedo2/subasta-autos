package ec.edu.espe.subasta.autos.repository;

import ec.edu.espe.subasta.autos.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Integer> {
    UsuarioEntity findByEmail(String email);
    
}
