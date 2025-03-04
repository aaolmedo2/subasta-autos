package ec.edu.espe.subasta.autos.api.DTO;

import java.time.LocalDate;

public class SubastaDTOc {
    private Integer id;
    private Integer autoId;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Float precioMinimo;
    private Boolean activa;
    private Integer ganadorId;

    // Getters y Setters


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getAutoId() {
        return autoId;
    }

    public void setAutoId(Integer autoId) {
        this.autoId = autoId;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Float getPrecioMinimo() {
        return precioMinimo;
    }

    public void setPrecioMinimo(Float precioMinimo) {
        this.precioMinimo = precioMinimo;
    }

    public Boolean getActiva() {
        return activa;
    }

    public void setActiva(Boolean activa) {
        this.activa = activa;
    }

    public Integer getGanadorId() {
        return ganadorId;
    }

    public void setGanadorId(Integer ganadorId) {
        this.ganadorId = ganadorId;
    }
}