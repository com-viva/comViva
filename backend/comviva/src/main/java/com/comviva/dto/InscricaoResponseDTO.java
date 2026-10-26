package com.comviva.dto;

import com.comviva.enums.StatusInscricao;

public record InscricaoResponseDTO(Long id, StatusInscricao status, Long usuarioId, Long eventoId) {}
