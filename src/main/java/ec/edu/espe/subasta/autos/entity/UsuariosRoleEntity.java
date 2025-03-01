package ec.edu.espe.subasta.autos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@AllArgsConstructor

@Entity
@Table(name = "usuarios_roles")
public class UsuariosRoleEntity {
    @SequenceGenerator(name = "usuarios_roles_id_gen", sequenceName = "usuarios_id_seq", allocationSize = 1)
    @EmbeddedId
    private UsuariosRoleEntityId id;

    @MapsId("usuarioId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioEntity usuario;

    @MapsId("rolId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "rol_id", nullable = false)
    private RoleEntity rol;

    public UsuariosRoleEntityId getId() {
        return id;
    }

    public void setId(UsuariosRoleEntityId id) {
        this.id = id;
    }

    public UsuarioEntity getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioEntity usuario) {
        this.usuario = usuario;
    }

    public RoleEntity getRol() {
        return rol;
    }

    public void setRol(RoleEntity rol) {
        this.rol = rol;
    }

    public UsuariosRoleEntity() {
    }

    public UsuariosRoleEntity(UsuariosRoleEntityId id, RoleEntity rol, UsuarioEntity usuario) {
        this.id = id;
        this.rol = rol;
        this.usuario = usuario;
    }
}