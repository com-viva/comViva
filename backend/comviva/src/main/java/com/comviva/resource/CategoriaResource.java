package com.comviva.resource;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.comviva.dto.CategoriaResponseDTO;
import com.comviva.service.CategoriaService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController 
@RequestMapping("/api/categorias")
public class CategoriaResource {
    
    private final CategoriaService categoriaService;

    public CategoriaResource(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    
    @GetMapping("")
    public ResponseEntity<List<CategoriaResponseDTO>> getAllCategorias() {
        return ResponseEntity.ok(categoriaService.findAllCategorias());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponseDTO> getCategoriaByIdEntity(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.findCategoriaById(id));
    }    
}
