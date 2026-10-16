package com.comviva.dto;

public record UsuarioResponseDTO (
    Long id, 
    String nome, 
    String telefone, 
    String email, 
    String foto,
    Boolean ativo
) {}
