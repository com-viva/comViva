package com.comviva.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.comviva.domain.Evento;
import com.comviva.dto.EventoRequestDTO;
import com.comviva.dto.EventoResponseDTO;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface EventoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "dataHoraFim", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    Evento toEntity(EventoRequestDTO eventoDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "dataHoraFim", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    void updateEventoFromDto(EventoRequestDTO dto, @MappingTarget Evento evento);

    @Mapping(target = "categoriaId", source = "categoria.id")
    @Mapping(target = "subcategoriaId", source = "subcategoria.id")
    @Mapping(target = "usuarioId", source = "usuario.id")
    EventoResponseDTO toDto(Evento evento);
    List<EventoResponseDTO> toDto(List<Evento> evento);
}
