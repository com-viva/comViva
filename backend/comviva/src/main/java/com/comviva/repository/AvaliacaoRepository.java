package com.comviva.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.comviva.domain.Avaliacao;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    
    List<Avaliacao> findAvaliacoesByEventoId(Long id);

    List<Avaliacao> findAvaliacaoByUsuarioId(Long id);
}
