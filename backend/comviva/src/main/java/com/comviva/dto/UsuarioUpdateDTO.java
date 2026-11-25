package com.comviva.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UsuarioUpdateDTO(
    @NotBlank
    String nome,

    @NotBlank
    String telefone,

    @Email
    @NotBlank
    String email,

    String foto
) {}