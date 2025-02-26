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
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    @Column(name = "precio_minimo", nullable = false)
    private Float precioMinimo;

    @ColumnDefault("true")
    @Column(name = "activa")
    private Boolean activa;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "ganador_id")
    private ec.edu.espe.subasta.autos.entity.UsuarioEntity ganador;

    public Integer getId() {
        return id;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public AutoEntity getAuto() {
        return auto;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public Float getPrecioMinimo() {
        return precioMinimo;
    }

    public Boolean getActiva() {
        return activa;
    }

    public UsuarioEntity getGanador() {
        return ganador;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setAuto(AutoEntity auto) {
        this.auto = auto;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public void setPrecioMinimo(Float precioMinimo) {
        this.precioMinimo = precioMinimo;
    }

    public void setActiva(Boolean activa) {
        this.activa = activa;
    }

    public void setGanador(UsuarioEntity ganador) {
        this.ganador = ganador;
    }
}