package com.comviva.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.comviva.domain.Inscricao;
import com.comviva.enums.StatusInscricao;

public interface InscricaoRepository extends JpaRepository<Inscricao, Long> {

    Optional<List<Inscricao>> findByUsuarioId(Long id);

    Optional<List<Inscricao>> findByEventoId(Long id);

    Boolean existsByUsuarioIdAndEventoId(Long usuarioId, Long eventoId);

    Long countByEventoIdAndStatus(Long eventoId, StatusInscricao status);

    Optional<List<Inscricao>> findByEventoIdAndStatus(Long eventoId, StatusInscricao status);


}