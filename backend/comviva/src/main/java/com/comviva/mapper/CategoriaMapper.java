package com.comviva.mapper;

import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;
import com.comviva.domain.Categoria;
import com.comviva.dto.CategoriaResponseDTO;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CategoriaMapper {
    
    CategoriaResponseDTO toDto(Categoria categoria);
    List<CategoriaResponseDTO> toDto(List<Categoria> categorias);
}
