package com.comviva.resource;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.comviva.domain.Evento;
import com.comviva.dto.EventoRequestDTO;
import com.comviva.service.EventoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<Evento>> getEventos(@RequestParam(required = false) String nome) {
        if (nome != null) {
            return ResponseEntity.ok(eventoService.findEventoByName(nome));
        }
        return ResponseEntity.ok(eventoService.findAllEventos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evento> getEventoById(@PathVariable Long id) {
        Evento evento = eventoService.findEventoById(id);
        return ResponseEntity.ok(evento);
    }

    @PostMapping("")
    public ResponseEntity<Void> saveEvento(@Valid @RequestBody EventoRequestDTO eventoRequestDTO) {
        eventoService.createEvento(eventoRequestDTO);
        return ResponseEntity.noContent().build();
    } 

    @PatchMapping("/{id}") 
    public ResponseEntity<Void> updateEvento(@PathVariable Long id, @RequestBody EventoRequestDTO eventoRequestDTO) {
        eventoService.updateEvento(id, eventoRequestDTO);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvento(@PathVariable Long id) {
        eventoService.deleteEvento(id);
        return ResponseEntity.noContent().build();
    }
}
