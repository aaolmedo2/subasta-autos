package ec.edu.espe.subasta.autos.repository;

import ec.edu.espe.subasta.autos.entity.UsuariosRoleEntity;
import ec.edu.espe.subasta.autos.entity.UsuariosRoleEntityId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioRolRepository extends JpaRepository<UsuariosRoleEntity, UsuariosRoleEntityId> {
    boolean existsByUsuarioIdAndRolId(Integer usuarioId, Integer rolId);
    List<UsuariosRoleEntity> findByUsuarioId(Integer userId);

}
