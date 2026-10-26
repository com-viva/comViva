package com.comviva.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.comviva.domain.Inscricao;
import com.comviva.dto.InscricaoRequestDTO;
import com.comviva.dto.InscricaoResponseDTO;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface InscricaoMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    Inscricao toEntity(InscricaoRequestDTO inscricaoDTO);
    List<Inscricao> toEntity(List<InscricaoRequestDTO> inscricaoDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "usuarioId", source = "usuario.id")
    @Mapping(target = "eventoId", source = "evento.id")
    InscricaoResponseDTO toDto(Inscricao inscricao);
    List<InscricaoResponseDTO> toDto(List<Inscricao> inscricao);
}
