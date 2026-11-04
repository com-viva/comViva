package com.comviva.dto;

import java.time.LocalDateTime;
import java.util.List;

public record GerarDescricaoRequestPythonDTO(
    String nomeEvento,
    String nivelEvento,
    String categoria,
    String subcategoria,
    LocalDateTime dataHora,
    String endereco,
    List<String> ultimasDescricoes
) {

    public GerarDescricaoRequestPythonDTO withUltimasDescricoes(List<String> ultimasDescricoes) {
        return new GerarDescricaoRequestPythonDTO(nomeEvento, nivelEvento, categoria, subcategoria, dataHora, endereco, ultimasDescricoes);
    }
}
