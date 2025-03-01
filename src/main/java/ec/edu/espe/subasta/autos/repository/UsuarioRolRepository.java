package ec.edu.espe.subasta.autos.repository;

import ec.edu.espe.subasta.autos.entity.RoleEntity;
import ec.edu.espe.subasta.autos.entity.UsuariosRoleEntity;
import ec.edu.espe.subasta.autos.entity.UsuariosRoleEntityId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UsuarioRolRepository extends JpaRepository<UsuariosRoleEntity, UsuariosRoleEntityId> {
    boolean existsByUsuarioIdAndRolId(Integer usuarioId, Integer rolId);
    List<UsuariosRoleEntity> findByUsuarioId(Integer userId);

    @Query("SELECT ur.rol FROM UsuariosRoleEntity ur WHERE ur.usuario.id = :usuarioId")
    List<RoleEntity> findRolesByUsuarioId(@Param("usuarioId") Integer usuarioId);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (:usuarioId, :rolId)", nativeQuery = true)
    void asignarRol(Integer usuarioId, Integer rolId);

}
