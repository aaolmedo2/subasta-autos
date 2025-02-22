package ec.edu.espe.subasta.autos.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "autos")
public class AutoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "autos_id_gen")
    @SequenceGenerator(name = "autos_id_gen", sequenceName = "autos_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "marca", nullable = false, length = 100)
    private String marca;

    @Column(name = "modelo", nullable = false, length = 100)
    private String modelo;

    @Column(name = "anio", nullable = false)
    private Integer anio;

    @Column(name = "precio_base", nullable = false)
    private Float precioBase;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "vendedor_id")
    private ec.edu.espe.subasta.autos.entity.UsuarioEntity vendedor;

    @ColumnDefault("false")
    @Column(name = "vendido")
    private Boolean vendido;

    @Column(name = "fecha_creacion")
    private LocalDate fechaCreacion;

}