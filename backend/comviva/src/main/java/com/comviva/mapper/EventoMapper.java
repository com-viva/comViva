package com.comviva.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.comviva.domain.Evento;
import com.comviva.dto.EventoRequestDTO;

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
}
