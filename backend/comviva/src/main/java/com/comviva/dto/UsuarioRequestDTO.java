package com.comviva.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioRequestDTO(
    @NotBlank(message = "O nome é obrigatório", groups = Criar.class) 
    String nome,

    @NotBlank(message = "O telefone é obrigatório", groups = Criar.class) 
    String telefone,

    @NotBlank(message = "O email é obrigatório", groups = Criar.class) 
    @Email(message = "Informe um email válido", groups = {Criar.class, Atualizar.class}) 
    String email,

    String foto,

    @NotBlank(message = "A senha é obrigatória", groups = Criar.class) 
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres", groups = {Criar.class, Atualizar.class}) 
    String senha
) {}
