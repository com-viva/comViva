package com.comviva.dto;

import java.time.LocalDateTime;
import com.comviva.enums.NivelEvento;
import com.comviva.enums.StatusEvento;

public record EventoResponseDTO(
    Long id,
    String nome,
    String descricao,
    LocalDateTime dataHora,
    LocalDateTime dataHoraFim,
    Long capacidadeMin,
    Long capacidadeMax,
    String endereco,
    StatusEvento status,
    NivelEvento nivel,
    Long categoriaId,
    Long subcategoriaId,
    Long usuarioId
) {}
