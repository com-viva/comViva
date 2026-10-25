package com.comviva.resource;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.comviva.dto.SubcategoriaResponseDTO;
import com.comviva.service.SubcategoriaService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController 
@RequestMapping("/api/subcategorias") 
public class SubcategoriaResource {
    
    SubcategoriaService subcategoriaService;

    public SubcategoriaResource(SubcategoriaService subcategoriaService) {
        this.subcategoriaService = subcategoriaService;
    }

    
    @GetMapping("")
    public ResponseEntity<List<SubcategoriaResponseDTO>> getAllSubcategorias() {
        return ResponseEntity.ok(subcategoriaService.findAllSubcategorias());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SubcategoriaResponseDTO> getSubcategoriaById(@PathVariable Long id) {
        return ResponseEntity.ok(subcategoriaService.findSubcategoriaById(id));
    }
    
    @GetMapping("/categoria/{id}")
    public ResponseEntity<List<SubcategoriaResponseDTO>> getSubcategoriasByCategoria(@PathVariable Long id) {
        return ResponseEntity.ok(subcategoriaService.findSubcategoriaByCategoria(id));
    }    
}
