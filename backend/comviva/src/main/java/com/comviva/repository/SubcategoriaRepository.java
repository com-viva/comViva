package com.comviva.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.comviva.domain.Subcategoria;

public interface SubcategoriaRepository extends JpaRepository<Subcategoria, Long>{
    
    public List<Subcategoria> findByCategoriaId(Long id);
}
