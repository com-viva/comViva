package com.comviva.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.comviva.domain.Evento;

public interface EventoRepository extends JpaRepository<Evento, Long> {
    Optional<List<Evento>> findByNome(String nome);
}
