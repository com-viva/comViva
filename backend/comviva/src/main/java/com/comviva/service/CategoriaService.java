package com.comviva.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.comviva.domain.Categoria;
import com.comviva.dto.CategoriaResponseDTO;
import com.comviva.exception.ResourceNotFoundException;
import com.comviva.mapper.CategoriaMapper;
import com.comviva.repository.CategoriaRepository;

@Service
public class CategoriaService {

    private CategoriaRepository categoriaRepository;
    private CategoriaMapper categoriaMapper;
    
    public CategoriaService(CategoriaRepository categoriaRepository, CategoriaMapper categoriaMapper) {
        this.categoriaRepository = categoriaRepository;
        this.categoriaMapper = categoriaMapper;
    }

    public List<CategoriaResponseDTO> findAllCategorias() {
        List<Categoria> categorias = categoriaRepository.findAll();
        return categoriaMapper.toDto(categorias);
    }

    public CategoriaResponseDTO findCategoriaById(Long id) {
        Categoria categoria = findCategoriaOrElseThrow(id);
        return categoriaMapper.toDto(categoria);
    }

    public Categoria findCategoriaOrElseThrow(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
    }
}
