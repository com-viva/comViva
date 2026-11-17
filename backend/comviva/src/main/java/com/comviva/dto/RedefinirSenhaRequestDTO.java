package com.comviva.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RedefinirSenhaRequestDTO {

    @NotBlank(message = "Informe o token.")
    private String token;

    @NotBlank(message = "Informe a nova senha.")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
    private String novaSenha;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNovaSenha() {
        return novaSenha;
    }

    public void setNovaSenha(String novaSenha) {
        this.novaSenha = novaSenha;
    }
}
