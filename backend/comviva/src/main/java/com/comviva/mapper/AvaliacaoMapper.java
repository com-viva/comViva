package com.comviva.mapper;

import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;
import com.comviva.domain.Avaliacao;
import com.comviva.dto.AvaliacaResponseDTO;
import com.comviva.dto.AvaliacaoRequestDTO;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AvaliacaoMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "evento", ignore = true) 
    Avaliacao toEntity(AvaliacaoRequestDTO avaliacaoDTO);
    List<Avaliacao> toEntity(List<AvaliacaoRequestDTO> avaliacaoDTOs);

    @Mapping(target = "usuarioId", source = "usuario.id")
    @Mapping(target = "eventoId", source = "evento.id")
    AvaliacaResponseDTO toDto(Avaliacao avaliacao);
    List<AvaliacaResponseDTO> toDto(List<Avaliacao> avaliacoes);
}
