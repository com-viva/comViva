package com.comviva.repository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.comviva.domain.Evento;
import com.comviva.enums.StatusEvento;
import com.comviva.projections.EventoResponseProjection;

public interface EventoRepository extends JpaRepository<Evento, Long> {
    Optional<List<Evento>> findByUsuarioId(Long id);

    @Query("""
        SELECT e.id AS id,
               e.nome AS nome,
               e.descricao AS descricao,
               e.dataHora AS dataHora,
               e.dataHoraFim AS dataHoraFim,
               e.capacidadeMin AS capacidadeMin,
               e.capacidadeMax AS capacidadeMax,
               e.endereco AS endereco,
               e.status AS status,
               e.nivel AS nivel,
               e.categoria.id AS categoriaId,
               e.subcategoria.id AS subcategoriaId,
               e.usuario.id AS usuarioId
        FROM Evento e
        WHERE (CAST(:nome AS String) IS NULL OR LOWER(e.nome) LIKE CONCAT('%', LOWER(CAST(:nome AS String)), '%'))
        AND (:categoriaId IS NULL OR e.categoria.id = :categoriaId)
        AND (:subcategoriaId IS NULL OR e.subcategoria.id = :subcategoriaId)
        AND (e.dataHora >= :agora OR (e.dataHora < :agora AND e.dataHoraFim >= :agora))
        AND e.status IN (com.comviva.enums.StatusEvento.AGENDADO, com.comviva.enums.StatusEvento.EM_ANDAMENTO)
        ORDER BY
            CASE WHEN EXISTS (
                SELECT i.id FROM InteresseUsuario i
                WHERE i.usuario.id = :usuarioId AND i.subcategoria.id = e.subcategoria.id
            ) THEN 0 ELSE 1 END,
            CASE WHEN EXISTS (
                SELECT i.id FROM InteresseUsuario i
                WHERE i.usuario.id = :usuarioId AND i.categoria.id = e.categoria.id
            ) THEN 0 ELSE 1 END,
            e.dataHora ASC
        """)
    List<EventoResponseProjection> findEventos(@Param("usuarioId") Long usuarioId, @Param("nome") String nome,
            @Param("categoriaId") Long categoriaId, @Param("subcategoriaId") Long subcategoriaId,
            @Param("agora") LocalDateTime agora);

    List<Evento> findByStatusAndDataHoraLessThanEqual(StatusEvento status, LocalDateTime dataHora);

    List<Evento> findByStatusAndDataHoraFimLessThanEqual(StatusEvento status, LocalDateTime dataHoraFim);

    // CONSULTA PARA GERAÇÃO DE DESCRIÇÕES PARA IA
    @Query("""
        SELECT e.descricao FROM Evento e
        ORDER BY e.id DESC
        """) 
    List<String> findLastDescricoes(Pageable pageable);
}
