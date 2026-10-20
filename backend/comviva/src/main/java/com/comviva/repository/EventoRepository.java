package com.comviva.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.comviva.domain.Evento;

public interface EventoRepository extends JpaRepository<Evento, Long> {
    Optional<List<Evento>> findByUsuarioId(Long id);

    @Query(value = """
        SELECT e.* FROM evento e
        
        WHERE (:nome IS NULL OR LOWER(e.nome) LIKE LOWER(CONCAT('%', :nome, '%'))) 
        AND (:categoriaId IS NULL OR e.categoria_id = :categoriaId)
        AND (:subcategoriaId IS NULL OR e.subcategoria_id = :subcategoriaId)
        AND (e.data_hora >= CURRENT_TIMESTAMP OR (e.data_hora < CURRENT_TIMESTAMP AND e.data_hora_fim >= CURRENT_TIMESTAMP))
        AND e.status IN ('AGENDADO', 'EM_ANDAMENTO')

        ORDER BY
            CASE
                WHEN EXISTS (
                    SELECT 1 FROM interesse_usuario i
                    WHERE i.usuario_id = :usuarioId AND i.categoria_id = e.categoria_id
                ) THEN 0
                ELSE 1
            END,
            CASE
                WHEN EXISTS (
                    SELECT 1 FROM interesse_usuario i
                    WHERE i.usuario_id = :usuarioId AND i.subcategoria_id = e.subcategoria_id
                ) THEN 0
                ELSE 1
            END,
            e.data_hora ASC
    """, nativeQuery = true)
    List<Evento> findEventos(@Param("usuarioId") Long usuarioId, @Param("nome") String nome, @Param("categoriaId") Long categoriaId, @Param("subcategoriaId") Long subcategoriaId);
}
