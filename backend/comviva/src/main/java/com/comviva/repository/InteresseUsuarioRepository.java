package com.comviva.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.comviva.domain.InteresseUsuario;

public interface InteresseUsuarioRepository extends JpaRepository<InteresseUsuario, Long> {
    
    Optional<List<InteresseUsuario>> findByUsuarioId(Long id);

    Boolean existsByUsuarioIdAndCategoriaId(Long usuarioId, Long categoriaId);

    Boolean existsByUsuarioIdAndSubcategoriaId(Long usuarioId, Long subcategoriaId);
}
