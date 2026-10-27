package com.comviva.resource;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.comviva.dto.Atualizar;
import com.comviva.dto.Criar;
import com.comviva.dto.EventoRequestDTO;
import com.comviva.dto.EventoResponseDTO;
import com.comviva.projections.EventoResponseProjection;
import com.comviva.security.UsuarioPrincipal;
import com.comviva.service.EventoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/eventos")
public class EventoResource {

    private final EventoService eventoService;

    public EventoResource(EventoService eventoService) {
        this.eventoService = eventoService;
    }

    @GetMapping("")
    public ResponseEntity<List<EventoResponseProjection>> getEventos(@AuthenticationPrincipal UsuarioPrincipal usuario, @RequestParam(required = false) String nome, @RequestParam(required = false) Long categoriaId, @RequestParam(required = false) Long subcategoriaId) {
        Long usuarioId = usuario.id();
        return ResponseEntity.ok(eventoService.findAllEventos(usuarioId, nome, categoriaId, subcategoriaId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoResponseDTO> getEventoById(@PathVariable Long id) {
        EventoResponseDTO evento = eventoService.findEventoById(id);
        return ResponseEntity.ok(evento);
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<EventoResponseDTO>> getEventosByUsuario(@AuthenticationPrincipal UsuarioPrincipal usuario) {
        Long usuarioId = usuario.id();
        List<EventoResponseDTO> eventos = eventoService.findEventosByUsuario(usuarioId);
        return ResponseEntity.ok(eventos);
    }

    @PostMapping("")
    public ResponseEntity<Void> saveEvento(@AuthenticationPrincipal UsuarioPrincipal usuario, @Validated(Criar.class) @RequestBody EventoRequestDTO eventoRequestDTO) {
        Long usuarioId = usuario.id();
        eventoService.createEvento(eventoRequestDTO, usuarioId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> updateEvento(@AuthenticationPrincipal UsuarioPrincipal usuario, @PathVariable Long id, @Validated(Atualizar.class) @RequestBody EventoRequestDTO eventoRequestDTO) {
        Long usuarioId = usuario.id();
        eventoService.updateEvento(id, eventoRequestDTO, usuarioId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/conclude") 
    public ResponseEntity<Void> concludeEvento(@AuthenticationPrincipal UsuarioPrincipal usuario, @PathVariable Long id) {
        Long usuarioId = usuario.id();        
        eventoService.concludeEvento(id, usuarioId);
        return ResponseEntity.noContent().build();
    } 

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvento(@PathVariable Long id) {
        eventoService.deleteEvento(id);
        return ResponseEntity.noContent().build();
    }
}
