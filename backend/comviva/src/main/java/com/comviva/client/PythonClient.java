package com.comviva.client;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.comviva.dto.DescricaoPythonResponseDTO;
import com.comviva.dto.GerarDescricaoRequestPythonDTO;

@Component
public class PythonClient {

    private final RestClient restClient;

    public PythonClient() {
        this.restClient = RestClient.create("http://localhost:8000");
    }

    public DescricaoPythonResponseDTO gerarDescricao(GerarDescricaoRequestPythonDTO requestDTO) {

        System.out.println("Dto" + requestDTO);

        return restClient.post()
                .uri("/api/gerar-descricao")
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestDTO)
                .retrieve()
                .body(DescricaoPythonResponseDTO.class);
    }
}
