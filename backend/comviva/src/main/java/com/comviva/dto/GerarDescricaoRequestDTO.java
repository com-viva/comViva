package com.comviva.dto;

import java.time.LocalDateTime;

import com.comviva.domain.Categoria;
import com.comviva.domain.Subcategoria;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GerarDescricaoRequestDTO(
    @NotBlank(message = "O nome do evento é obrigatório") 
    String nome,

    @NotBlank(message = "O nível do evento é obrigatório") 
    String nivelEvento,

    @NotBlank(message = "A categoria do evento é obrigatória") 
    Categoria categoria,

    Subcategoria subcategoria,

    @NotNull(message = "a data e hora são obrigatórias") 
    LocalDateTime dataHora
) {}
