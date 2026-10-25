package com.comviva.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.comviva.domain.Categoria;
import com.comviva.domain.Subcategoria;
import com.comviva.dto.SubcategoriaResponseDTO;
import com.comviva.exception.ResourceNotFoundException;
import com.comviva.mapper.SubcategoriaMapper;
import com.comviva.repository.SubcategoriaRepository;

@Service 
public class SubcategoriaService {
    
    private SubcategoriaRepository subcategoriaRepository;
    private SubcategoriaMapper subcategoriaMapper;
    private CategoriaService categoriaService;

    

    public SubcategoriaService(SubcategoriaRepository subcategoriaRepository, SubcategoriaMapper subcategoriaMapper, CategoriaService categoriaService) {
        this.subcategoriaRepository = subcategoriaRepository;
        this.subcategoriaMapper = subcategoriaMapper;
        this.categoriaService = categoriaService;
    }

    public List<SubcategoriaResponseDTO> findAllSubcategorias() {
        List<Subcategoria> subcategorias = subcategoriaRepository.findAll();
        return subcategoriaMapper.toDto(subcategorias);
    }

    public SubcategoriaResponseDTO findSubcategoriaById(Long id) {
        Subcategoria subcategoria = findSubcategoriaOrElseThrow(id);
        return subcategoriaMapper.toDto(subcategoria);
    }

    public List<SubcategoriaResponseDTO> findSubcategoriaByCategoria(Long id) {
        Categoria categoria = categoriaService.findCategoriaOrElseThrow(id);
        List<Subcategoria> subcategorias = subcategoriaRepository.findByCategoriaId(categoria.getId());
        return subcategoriaMapper.toDto(subcategorias);
    }

    public Subcategoria findSubcategoriaOrElseThrow(Long id) {
        return subcategoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subcategoria não encontrada"));
    }
}
