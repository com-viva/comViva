package com.comviva.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.comviva.domain.Categoria;


public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    
}
