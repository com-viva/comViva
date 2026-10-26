package com.comviva.resource;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.comviva.dto.InscricaoResponseDTO;
import com.comviva.security.UsuarioPrincipal;
import com.comviva.service.InscricaoService;

@RestController
@RequestMapping("/api/inscricoes")
public class InscricaoResource {
    
    private final InscricaoService inscricaoService;

    public InscricaoResource(InscricaoService inscricaoService) {
        this.inscricaoService = inscricaoService;
    }

    @GetMapping("/usuario")
    public ResponseEntity<List<InscricaoResponseDTO>> getInscricoesByUsuario(@AuthenticationPrincipal UsuarioPrincipal usuario) {
        Long usuarioId = usuario.id();
        return ResponseEntity.ok(inscricaoService.findByUsuarioId(usuarioId));
    }

    @GetMapping("/evento/{id}")
    public ResponseEntity<List<InscricaoResponseDTO>> getInscricoesByEvento(@PathVariable Long id) {
        return ResponseEntity.ok(inscricaoService.findByEventoId(id));
    }

    @PostMapping("/evento/{id}")
    public ResponseEntity<Void> saveInscricao(@AuthenticationPrincipal UsuarioPrincipal usuario, @PathVariable Long id) {
        Long usuarioId = usuario.id();
        inscricaoService.createInscricao(usuarioId, id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("{id}")
    public ResponseEntity<Void> cancelInscricao(@AuthenticationPrincipal UsuarioPrincipal usuario, @PathVariable Long id) {
        Long usuarioId = usuario.id();
        inscricaoService.cancelInscricao(usuarioId, id);
        return ResponseEntity.noContent().build();
    }
}
