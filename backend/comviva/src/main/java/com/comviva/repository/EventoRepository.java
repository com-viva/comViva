package com.comviva.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.comviva.domain.Evento;


public interface EventoRepository extends JpaRepository<Evento, Long> {

}
