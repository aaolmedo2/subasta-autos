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
@Table(name = "subastas")
public class SubastaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "subastas_id_gen")
    @SequenceGenerator(name = "subastas_id_gen", sequenceName = "subastas_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "auto_id")
    private AutoEntity auto;

    @Column(name = "fecha_inicio", nullable = false)
    private Instant fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private Instant fechaFin;

    @Column(name = "precio_minimo", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioMinimo;

    @ColumnDefault("true")
    @Column(name = "activa")
    private Boolean activa;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "ganador_id")
    private ec.edu.espe.subasta.autos.entity.UsuarioEntity ganador;

}