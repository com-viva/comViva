package com.comviva.dto;

import java.time.LocalDateTime;
import java.util.List;

public record GerarDescricaoResponseDTO(
    String nomeEvento,
    String nivelEvento,
    String categoria,
    String subcategoria,
    LocalDateTime dataHora,
    String endereco,
    List<String> ultimasDescricoes
) {

    public GerarDescricaoResponseDTO withUltimasDescricoes(List<String> ultimasDescricoes) {
        return new GerarDescricaoResponseDTO(nomeEvento, nivelEvento, categoria, subcategoria, dataHora, endereco, ultimasDescricoes);
    }
}
