package com.comviva.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.comviva.domain.Evento;
import com.comviva.exception.ResourceNotFoundException;
import com.comviva.repository.EventoRepository;

@Service
public class EventoService {

    private EventoRepository eventoRepository;

    public EventoService(EventoRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }

    public List<Evento> findAllEventos() {
        List<Evento> eventos = eventoRepository.findAll();
        return eventos;
    }

    public Evento findEventoById(Long id) {
        return findEventoOrElseThrow(id);
    }

    






    private Evento findEventoOrElseThrow(Long id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado"));
    }
}
