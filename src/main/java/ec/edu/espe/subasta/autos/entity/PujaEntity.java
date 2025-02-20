package ec.edu.espe.subasta.autos.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "pujas")
public class PujaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pujas_id_gen")
    @SequenceGenerator(name = "pujas_id_gen", sequenceName = "pujas_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "subasta_id")
    private ec.edu.espe.subasta.autos.entity.SubastaEntity subasta;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "comprador_id")
    private ec.edu.espe.subasta.autos.entity.UsuarioEntity comprador;

    @Column(name = "monto", nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "fecha_puja")
    private Instant fechaPuja;

}