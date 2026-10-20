package com.comviva.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.comviva.domain.Evento;
import com.comviva.dto.EventoRequestDTO;
import com.comviva.exception.ResourceNotFoundException;
import com.comviva.mapper.EventoMapper;
import com.comviva.repository.EventoRepository;

@Service
public class EventoService {

    private EventoRepository eventoRepository;

    private EventoMapper eventoMapper;

    public EventoService(EventoRepository eventoRepository, EventoMapper eventoMapper) {
        this.eventoRepository = eventoRepository;
        this.eventoMapper = eventoMapper;
    }

    public List<Evento> findAllEventos() {
        List<Evento> eventos = eventoRepository.findAll();
        return eventos;
    }

    public Evento findEventoById(Long id) {
        return findEventoByIdOrElseThrow(id);
    }

    public List<Evento> findEventoByName(String nome) {
        return eventoRepository.findByNome(nome)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado"));
    }

    public void createEvento(EventoRequestDTO eventoRequestDTO) {
        Evento evento = eventoMapper.toEntity(eventoRequestDTO);
        eventoRepository.save(evento);
    }

    public void updateEvento(Long id, EventoRequestDTO eventoRequestDTO) {
        Evento evento = findEventoByIdOrElseThrow(id);
        eventoMapper.updateEventoFromDto(eventoRequestDTO, evento);
        eventoRepository.save(evento);
    }

    public void deleteEvento(Long id) {
        eventoRepository.deleteById(id);
    }

    private Evento findEventoByIdOrElseThrow(Long id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado"));
    }
}
