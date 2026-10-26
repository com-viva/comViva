package com.comviva.service;

import java.util.List;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.comviva.domain.Avaliacao;
import com.comviva.domain.Categoria;
import com.comviva.domain.Evento;
import com.comviva.domain.Subcategoria;
import com.comviva.domain.Usuario;
import com.comviva.dto.AvaliacaResponseDTO;
import com.comviva.dto.AvaliacaoRequestDTO;
import com.comviva.dto.InteresseUsuarioRequestDTO;
import com.comviva.exception.ResourceNotFoundException;
import com.comviva.mapper.AvaliacaoMapper;
import com.comviva.repository.AvaliacaoRepository;

@Service
public class AvaliacaoService {

    private AvaliacaoRepository avaliacaoRepository;
    private AvaliacaoMapper avaliacaoMapper;
    private InteresseUsuarioService interesseUsuarioService;
    private UsuarioService usuarioService;
    private EventoService eventoService;

    public AvaliacaoService(
            AvaliacaoRepository avaliacaoRepository,
            AvaliacaoMapper avaliacaoMapper,
            InteresseUsuarioService interesseUsuarioService,
            UsuarioService usuarioService,
            EventoService eventoService) {
        this.avaliacaoRepository = avaliacaoRepository;
        this.avaliacaoMapper = avaliacaoMapper;
        this.interesseUsuarioService = interesseUsuarioService;
        this.usuarioService = usuarioService;
        this.eventoService = eventoService;
    }

    public List<AvaliacaResponseDTO> findAvaliacaoByEvento(Long eventoId) {

        List<Avaliacao> avaliacoesEvento = avaliacaoRepository.findAvaliacoesByEventoId(eventoId);
        return avaliacaoMapper.toDto(avaliacoesEvento);
    }

    public List<AvaliacaResponseDTO> findAvaliacaoByUsuario(Long usuarioId) {

        List<Avaliacao> avaliacoesUsuario = avaliacaoRepository.findAvaliacaoByUsuarioId(usuarioId);
        return avaliacaoMapper.toDto(avaliacoesUsuario);
    }

    @Transactional
    public void createAvaliacao(Long usuarioId, Long eventoId, AvaliacaoRequestDTO avaliacaoRequestDTO) {

        Usuario usuario = usuarioService.findUsuarioOrElseThrow(usuarioId);
        Evento evento = eventoService.findEventoOrElseThrow(eventoId);
        Avaliacao avaliacao = avaliacaoMapper.toEntity(avaliacaoRequestDTO);

        avaliacao.setUsuario(usuario);
        avaliacao.setEvento(evento);

        avaliacaoRepository.save(avaliacao);

        if (avaliacao.getAvaliacao() == 5) {
            Categoria categoria = evento.getCategoria();
            Subcategoria subcategoria = evento.getSubcategoria();

            InteresseUsuarioRequestDTO interesseDTO = new InteresseUsuarioRequestDTO(categoria, subcategoria);

            interesseUsuarioService.createInteresse(interesseDTO, usuarioId);
        }
    }

    public void deleteAvaliacao(Long usuarioId, Long id) {

        Avaliacao avaliacao = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Avaliação não encontrada"));

        if (!avaliacao.getUsuario().getId().equals(usuarioId)) {
            throw new AccessDeniedException("Você não tem permissão para excluir esta avaliação");
        }

        avaliacaoRepository.delete(avaliacao);
    }
}
