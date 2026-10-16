package com.comviva.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.comviva.domain.Usuario;
import com.comviva.dto.UsuarioRequestDTO;
import com.comviva.dto.UsuarioResponseDTO;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UsuarioMapper {

    UsuarioResponseDTO toDto(Usuario usuario);
    List<UsuarioResponseDTO> toDto(List<Usuario> usuarios);

    @Mapping(target = "senha", ignore = true)
    Usuario toEntity(UsuarioResponseDTO usuarioDTO);
    List<Usuario> toEntity(List<UsuarioResponseDTO> usuarioDTOs);

    @Mapping(target = "senha", ignore = true) 
    void updateUsuarioFromDto(UsuarioResponseDTO dto, @MappingTarget Usuario usuario);

    @Mapping(target = "senha", ignore = true)
    @Mapping(target = "id", ignore = true) 
    @Mapping(target = "ativo", ignore = true) 
    Usuario toEntity(UsuarioRequestDTO usuarioDTO);

    @Mapping(target = "senha", ignore = true) 
    @Mapping(target = "id", ignore = true) 
    @Mapping(target = "ativo", ignore = true) 
    void updateUsuarioFromDto(UsuarioRequestDTO dto, @MappingTarget Usuario usuario);
}
