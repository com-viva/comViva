package com.comviva.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;
import com.comviva.domain.InteresseUsuario;
import com.comviva.dto.InteresseUsuarioRequestDTO;
import com.comviva.dto.InteresseUsuarioResponseDTO;


@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface InteresseUsuarioMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    InteresseUsuario toEntity(InteresseUsuarioRequestDTO interesseDTO);
    List<InteresseUsuario> toEntity(List<InteresseUsuarioRequestDTO> interesseDTOs);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "usuarioId", source = "usuario.id")
    @Mapping(target = "categoriaId", source = "categoria.id")
    @Mapping(target = "subcategoriaId", source = "subcategoria.id")
    InteresseUsuarioResponseDTO toDto(InteresseUsuario interesse);
    List<InteresseUsuarioResponseDTO> toDto(List<InteresseUsuario> interesses);
}