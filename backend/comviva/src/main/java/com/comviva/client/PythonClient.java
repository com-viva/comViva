package com.comviva.client;

import java.net.http.HttpClient;

import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import com.comviva.dto.DescricaoPythonResponseDTO;
import com.comviva.dto.GerarDescricaoRequestPythonDTO;

@Component
public class PythonClient {

    private final RestClient restClient;

    public PythonClient() {
        HttpClient httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .build();

        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:8000")
                .requestFactory(new JdkClientHttpRequestFactory(httpClient))
                .build();
    }

    public DescricaoPythonResponseDTO gerarDescricao(GerarDescricaoRequestPythonDTO requestDTO) {
        System.out.println("Dto: " + requestDTO);

        try {
            return restClient.post()
                    .uri("/api/gerar-descricao")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestDTO)
                    .retrieve()
                    .body(DescricaoPythonResponseDTO.class);
        } catch (RestClientResponseException e) {
            System.err.println("Erro HTTP " + e.getStatusCode() + ": " + e.getResponseBodyAsString());
            throw e;
        }
    }
}
