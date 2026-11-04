package com.comviva.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GerarDescricaoRequestDTO(
    @NotBlank(message = "O nome do evento é obrigatório") 
    String nomeEvento,

    @NotBlank(message = "O nível do evento é obrigatório") 
    String nivelEvento,

    @NotNull(message = "A categoria do evento é obrigatória") 
    Long categoriaId,

    Long subcategoriaId,

    @NotNull(message = "A data e hora são obrigatórias") 
    LocalDateTime dataHora,

    @NotBlank(message = "O endereço do evento é obrigatório") 
    String endereco
) {}
