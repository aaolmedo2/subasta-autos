package ec.edu.espe.subasta.autos.api.DTO;

import java.time.LocalDate;

public class PujaDTO {
    private Integer subastaId;
    private Integer compradorId;
    private Float monto;
    private LocalDate fechaPuja;

    // Getters y Setters
    public Integer getSubastaId() {
        return subastaId;
    }

    public void setSubastaId(Integer subastaId) {
        this.subastaId = subastaId;
    }

    public Integer getCompradorId() {
        return compradorId;
    }

    public void setCompradorId(Integer compradorId) {
        this.compradorId = compradorId;
    }

    public Float getMonto() {
        return monto;
    }

    public void setMonto(Float monto) {
        this.monto = monto;
    }

    public LocalDate getFechaPuja() {
        return fechaPuja;
    }

    public void setFechaPuja(LocalDate fechaPuja) {
        this.fechaPuja = fechaPuja;
    }
} 