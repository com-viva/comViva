package com.comviva.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.comviva.domain.Categoria;
import com.comviva.domain.Evento;
import com.comviva.domain.Subcategoria;
import com.comviva.domain.Usuario;
import com.comviva.dto.EventoRequestDTO;
import com.comviva.dto.EventoResponseDTO;
import com.comviva.enums.StatusEvento;
import com.comviva.exception.ResourceNotFoundException;
import com.comviva.mapper.EventoMapper;
import com.comviva.projections.EventoResponseProjection;
import com.comviva.repository.EventoRepository;

@Service
public class EventoService {

    private EventoRepository eventoRepository;
    private EventoMapper eventoMapper;
    private UsuarioService usuarioService;
    private CategoriaService categoriaService;
    private SubcategoriaService subcategoriaService;

    public EventoService(EventoRepository eventoRepository, EventoMapper eventoMapper, UsuarioService usuarioService, CategoriaService categoriaService, SubcategoriaService subcategoriaService) {
        this.eventoRepository = eventoRepository;
        this.eventoMapper = eventoMapper;
        this.usuarioService = usuarioService;
        this.categoriaService = categoriaService;
        this.subcategoriaService = subcategoriaService;
    }

    public List<EventoResponseProjection> findAllEventos(Long idUsuario, String nome, Long categoriaId, Long subcategoriaId) {
        return eventoRepository.findEventos(idUsuario, nome, categoriaId, subcategoriaId, LocalDateTime.now());
    }

    public EventoResponseDTO findEventoById(Long id) {
        Evento evento = findEventoOrElseThrow(id);
        return eventoMapper.toDto(evento);
    }

    public List<EventoResponseDTO> findEventosByUsuario(Long id) {
        List<Evento> eventos = eventoRepository.findByUsuarioId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nenhum evento encontrado"));
        return eventoMapper.toDto(eventos);
    }

    public void createEvento(EventoRequestDTO eventoRequestDTO, Long usuarioId) {

        Categoria categoria = categoriaService.findCategoriaOrElseThrow(eventoRequestDTO.categoria().getId());

        if (eventoRequestDTO.subcategoria() != null) {
            Subcategoria subcategoria = subcategoriaService.findSubcategoriaOrElseThrow(eventoRequestDTO.subcategoria().getId());

            if (!subcategoria.getCategoria().getId().equals(categoria.getId())) {
                throw new IllegalArgumentException("A subcategoria não pertence à categoria informada.");
            }
        }

        Evento evento = eventoMapper.toEntity(eventoRequestDTO);
        Usuario usuario = usuarioService.findUsuarioOrElseThrow(usuarioId);

        evento.setCategoria(categoria);
        evento.setDataHoraFim(evento.getDataHora().plusHours(4));
        evento.setStatus(StatusEvento.AGENDADO);
        evento.setUsuario(usuario);

        eventoRepository.save(evento);
    }

    public void updateEvento(Long id, EventoRequestDTO eventoRequestDTO, Long usuarioId) {
        Evento evento = findEventoOrElseThrow(id);

        authorizeUserEdit(usuarioId, evento);

        eventoMapper.updateEventoFromDto(eventoRequestDTO, evento);
        eventoRepository.save(evento);
    }

    public void deleteEvento(Long id) {
        eventoRepository.deleteById(id);
    }

    public void concludeEvento(Long id, Long usuarioId) {
        Evento evento = findEventoOrElseThrow(id);

        authorizeUserEdit(usuarioId, evento);

        evento.setStatus(StatusEvento.CONCLUIDO);
        evento.setDataHoraFim(LocalDateTime.now());

        eventoRepository.save(evento);
    }

    public Evento findEventoOrElseThrow(Long id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado"));
    }

    private void authorizeUserEdit(Long usuarioId, Evento evento) {
        if (!evento.getUsuario().getId().equals(usuarioId)) {
            throw new AccessDeniedException("Você não tem permissão para editar este evento");
        }
    }
}
