package com.comviva.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.comviva.domain.Categoria;
import com.comviva.domain.Subcategoria;
import com.comviva.dto.GerarDescricaoResponseDTO;
import com.comviva.dto.GerarDescricaoRequestDTO;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface DescricaoPythonMapper {
    
    @Mapping(target = "categoria", source = "categoria.nome")
    @Mapping(target = "subcategoria", source = "subcategoria.nome")
    @Mapping(target = "ultimasDescricoes", ignore = true)
    GerarDescricaoResponseDTO toDto(GerarDescricaoRequestDTO gerarDescricaoRequestDTO, Categoria categoria, Subcategoria subcategoria);
}
