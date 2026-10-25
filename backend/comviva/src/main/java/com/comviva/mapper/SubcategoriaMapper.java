package com.comviva.mapper;

import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;
import com.comviva.domain.Subcategoria;
import com.comviva.dto.SubcategoriaResponseDTO;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface SubcategoriaMapper {
    
    @Mapping(target = "categoriaId", source = "categoria.id")
    SubcategoriaResponseDTO toDto(Subcategoria subcategoria);
    List<SubcategoriaResponseDTO> toDto(List<Subcategoria> subcategorias);
}
