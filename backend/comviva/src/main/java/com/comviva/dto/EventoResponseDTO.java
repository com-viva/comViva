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
    Long qntdInscritos,
    Long capacidadeMin,
    Long capacidadeMax,
    String endereco,
    StatusEvento status,
    NivelEvento nivel,
    Long categoriaId,
    String categoria,
    Long subcategoriaId,
    String subcategoria,
    Long usuarioId
) {}
