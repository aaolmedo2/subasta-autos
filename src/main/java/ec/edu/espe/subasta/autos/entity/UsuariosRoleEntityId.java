package ec.edu.espe.subasta.autos.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.util.Objects;

@Getter
@Setter
@Embeddable
@AllArgsConstructor
@NoArgsConstructor
public class UsuariosRoleEntityId implements java.io.Serializable {
    private static final long serialVersionUID = 4421373858900473277L;
    @Column(name = "usuario_id", nullable = false)
    private Integer usuarioId;

    @Column(name = "rol_id", nullable = false)
    private Integer rolId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        UsuariosRoleEntityId entity = (UsuariosRoleEntityId) o;
        return Objects.equals(this.rolId, entity.rolId) &&
                Objects.equals(this.usuarioId, entity.usuarioId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(rolId, usuarioId);
    }

    public UsuariosRoleEntityId() {
    }

    public UsuariosRoleEntityId(Integer usuarioId, Integer rolId) {
        this.usuarioId = usuarioId;
        this.rolId = rolId;
    }
}