package com.comviva.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.comviva.domain.Evento;
import com.comviva.domain.Inscricao;
import com.comviva.domain.Usuario;
import com.comviva.dto.InscricaoResponseDTO;
import com.comviva.enums.StatusInscricao;
import com.comviva.exception.BusinessRuleException;
import com.comviva.exception.ConflictException;
import com.comviva.exception.ResourceNotFoundException;
import com.comviva.mapper.InscricaoMapper;
import com.comviva.repository.EventoRepository;
import com.comviva.repository.InscricaoRepository;

@Service 
public class InscricaoService {

    private InscricaoRepository inscricaoRepository;
    private InscricaoMapper inscricaoMapper;
    private UsuarioService usuarioService;
    private EventoRepository eventoRepository;

    public InscricaoService(InscricaoRepository inscricaoRepository, InscricaoMapper inscricaoMapper, UsuarioService usuarioService, EventoRepository eventoRepository) {
        this.inscricaoRepository = inscricaoRepository;
        this.inscricaoMapper = inscricaoMapper;
        this.usuarioService = usuarioService;
        this.eventoRepository = eventoRepository;
    }

    public List<InscricaoResponseDTO> findByUsuarioId(Long id) {

        List<Inscricao> inscricoesUsuario = inscricaoRepository.findByUsuarioId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nenhuma inscrição encontrada"));
        return inscricaoMapper.toDto(inscricoesUsuario);
    }

    public List<InscricaoResponseDTO> findByEventoId(Long id) {

        List<Inscricao> inscricoesEvento = inscricaoRepository.findByEventoId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nenhuma inscrição encontrada"));
        return inscricaoMapper.toDto(inscricoesEvento);
    }

    public void createInscricao(Long usuarioId, Long eventoId) {

        Usuario usuario = usuarioService.findUsuarioOrElseThrow(usuarioId);
        Evento evento = eventoRepository.findById(eventoId)
            .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado"));

        if (inscricaoRepository.countByEventoIdAndStatus(eventoId, StatusInscricao.REALIZADA) >= evento.getCapacidadeMax()) {
            throw new BusinessRuleException("Este evento já atingiu sua capacidade máxima");
        }

        if (!evento.getDataHora().isAfter(LocalDateTime.now())) {
            throw new BusinessRuleException("Este evento já começou");
        }

        if (checkInscricaoExists(usuarioId, eventoId, StatusInscricao.REALIZADA)) {
            throw new ConflictException("Este usuário já possui uma inscrição neste evento");
        }

        Inscricao inscricao = new Inscricao();

        inscricao.setUsuario(usuario);
        inscricao.setEvento(evento);
        inscricao.setStatus(StatusInscricao.REALIZADA);

        inscricaoRepository.save(inscricao);
    }

    public void cancelInscricao(Long usuaroId, Long id) {

        Inscricao inscricao = findInscricaoOrElseThrow(id);

        if (!inscricao.getUsuario().getId().equals(usuaroId)) {
            throw new AccessDeniedException("Você não tem permissão para excluir este interesse");
        }

        cancelarInscricao(inscricao);
    }

    public void cancelInscricoesByEvento(Long eventoId) {
        List<Inscricao> inscricoes = inscricaoRepository.findByEventoIdAndStatus(eventoId, StatusInscricao.REALIZADA)
                .orElseThrow(() -> new ResourceNotFoundException("Nenhuma inscrição encontrada"));

        inscricoes.forEach(this::cancelarInscricao);
    }

    public Inscricao findInscricaoOrElseThrow(Long id) {
        return inscricaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interesse não encontrado"));
    }

    private void cancelarInscricao(Inscricao inscricao) {
        inscricao.setStatus(StatusInscricao.CANCELADA);
        inscricaoRepository.save(inscricao);
    }

    public Boolean checkInscricaoExists(Long usuarioId, Long eventoId, StatusInscricao status) {
        return inscricaoRepository.existsByUsuarioIdAndEventoIdAndStatus(usuarioId, eventoId, status);
    }
}
