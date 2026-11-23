package com.comviva.repository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.comviva.enums.StatusEvento;

import org.springframework.data.jpa.repository.JpaRepository;
import com.comviva.domain.Inscricao;
import com.comviva.enums.StatusInscricao;

public interface InscricaoRepository extends JpaRepository<Inscricao, Long> {

    @Query("""
            SELECT COUNT(i) > 0
            FROM Inscricao i
            JOIN i.evento e
            WHERE i.usuario.id = :usuarioId
              AND i.status = :statusInscricao
              AND e.status IN :statusEventos
              AND e.dataHora < :dataHoraFim
              AND e.dataHoraFim > :dataHora
            """)
            
    boolean existsConflitoHorario(
            @Param("usuarioId") Long usuarioId,
            @Param("statusInscricao") StatusInscricao statusInscricao,
            @Param("statusEventos") List<StatusEvento> statusEventos,
            @Param("dataHora") LocalDateTime dataHora,
            @Param("dataHoraFim") LocalDateTime dataHoraFim);

    Optional<List<Inscricao>> findByUsuarioId(Long id);

    Optional<List<Inscricao>> findByEventoId(Long id);

    Boolean existsByUsuarioIdAndEventoId(Long usuarioId, Long eventoId);

    Long countByEventoIdAndStatus(Long eventoId, StatusInscricao status);

    Optional<List<Inscricao>> findByEventoIdAndStatus(Long eventoId, StatusInscricao status);

    Boolean existsByUsuarioIdAndEventoIdAndStatus(Long usuarioId, Long eventoId, StatusInscricao status);

}