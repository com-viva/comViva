package com.comviva.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record AvaliacaoRequestDTO(
    @Min(value = 0, message = "O valor mínimo deve ser 0") 
    @Max(value = 5, message = "O valor máximo deve ser 5") 
    Long avaliacao) {}
