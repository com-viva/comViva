package com.comviva.projections;

import java.time.LocalDateTime;

import com.comviva.enums.NivelEvento;
import com.comviva.enums.StatusEvento;

public interface EventoResponseProjection {
    Long getId();
    String getNome();
    String getDescricao();
    LocalDateTime getDataHora();
    LocalDateTime getDataHoraFim();
    Long getCapacidadeMin();
    Long getCapacidadeMax();
    String getEndereco();
    StatusEvento getStatus();
    NivelEvento getNivel();
    Long getCategoriaId();
    Long getSubcategoriaId();
    Long getUsuarioId();
}
