package com.comviva.dto;

import com.comviva.domain.Evento;
import com.comviva.domain.Usuario;
import jakarta.validation.constraints.NotNull;

public record InscricaoRequestDTO(@NotNull Usuario usuario, @NotNull Evento evento) {}
