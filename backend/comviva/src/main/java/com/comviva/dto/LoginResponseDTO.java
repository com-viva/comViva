
package com.comviva.dto;

public class LoginResponseDTO {

    private String token;
    private String tipo;

    public LoginResponseDTO(String token, String tipo) {
        this.token = token;
        this.tipo = tipo;
    }

    public String getToken() {
        return token;
    }

    public String getTipo() {
        return tipo;
    }
}
