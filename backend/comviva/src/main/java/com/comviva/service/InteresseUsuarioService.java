package com.comviva.service;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.comviva.domain.InteresseUsuario;
import com.comviva.domain.Usuario;
import com.comviva.dto.InteresseUsuarioRequestDTO;
import com.comviva.dto.InteresseUsuarioResponseDTO;
import com.comviva.exception.ResourceNotFoundException;
import com.comviva.mapper.InteresseUsuarioMapper;
import com.comviva.repository.InteresseUsuarioRepository;

@Service
public class InteresseUsuarioService {

    private InteresseUsuarioRepository interesseUsuarioRepository;
    private InteresseUsuarioMapper interesseUsuarioMapper;
    private UsuarioService usuarioService;
    private CategoriaService categoriaService;
    private SubcategoriaService subcategoriaService;

    public InteresseUsuarioService(
            InteresseUsuarioRepository interesseUsuarioRepository,
            InteresseUsuarioMapper interesseUsuarioMapper,
            UsuarioService usuarioService,
            CategoriaService categoriaService,
            SubcategoriaService subcategoriaService) {
        this.interesseUsuarioRepository = interesseUsuarioRepository;
        this.interesseUsuarioMapper = interesseUsuarioMapper;
        this.usuarioService = usuarioService;
        this.categoriaService = categoriaService;
        this.subcategoriaService = subcategoriaService;
    }

    public List<InteresseUsuarioResponseDTO> findInteressesByUsuario(Long id) {
        List<InteresseUsuario> interesses = interesseUsuarioRepository.findByUsuarioId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interesses não encontrados"));
        return interesseUsuarioMapper.toDto(interesses);
    }

    public void createInteresse(InteresseUsuarioRequestDTO interesseUsuarioRequestDTO, Long usuarioId) {

        InteresseUsuario interesseUsuario = interesseUsuarioMapper.toEntity(interesseUsuarioRequestDTO);
        Usuario usuario = usuarioService.findUsuarioOrElseThrow(usuarioId);

        interesseUsuario.setUsuario(usuario);

        if (interesseUsuario.getSubcategoria() != null) {

            Long subcategoriaId = interesseUsuario.getSubcategoria().getId();
            subcategoriaService.findSubcategoriaOrElseThrow(subcategoriaId);

            if (interesseUsuarioRepository.existsByUsuarioIdAndSubcategoriaId(usuarioId, subcategoriaId)) {
                return;
            }

            interesseUsuario.setCategoria(null);
        }

        else {
            Long categoriaId = interesseUsuario.getCategoria().getId();
            categoriaService.findCategoriaOrElseThrow(categoriaId);

            if (interesseUsuarioRepository.existsByUsuarioIdAndCategoriaId(usuarioId, categoriaId)) {
                return;
            }
        }

        interesseUsuarioRepository.save(interesseUsuario);
    }

    public void deleteInteresseUsuario(Long id, Long usuarioId) {

        InteresseUsuario interesseUsuario = findInteresseUsuarioOrElseThrow(id);

        if (!interesseUsuario.getUsuario().getId().equals(usuarioId)) {
            throw new AccessDeniedException(
                    "Você não tem permissão para excluir este interesse");
        }

        interesseUsuarioRepository.delete(interesseUsuario);
    }

    public InteresseUsuario findInteresseUsuarioOrElseThrow(Long id) {
        return interesseUsuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interesse não encontrado"));
    }
}
