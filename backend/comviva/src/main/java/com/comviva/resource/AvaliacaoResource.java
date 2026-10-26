package com.comviva.resource;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.comviva.dto.AvaliacaResponseDTO;
import com.comviva.dto.AvaliacaoRequestDTO;
import com.comviva.security.UsuarioPrincipal;
import com.comviva.service.AvaliacaoService;

@RestController 
@RequestMapping("/api/avaliacoes") 
public class AvaliacaoResource {
    
    private final AvaliacaoService avaliacaoService;

    public AvaliacaoResource(AvaliacaoService avaliacaoService) {
        this.avaliacaoService = avaliacaoService;
    }


    @GetMapping("/evento/{id}")
    public ResponseEntity<List<AvaliacaResponseDTO>> getAvaliacoesByEvento(@PathVariable Long id) {
        return ResponseEntity.ok(avaliacaoService.findAvaliacaoByEvento(id));
    }

    @GetMapping("/usuario")
    public ResponseEntity<List<AvaliacaResponseDTO>> getAvaliacoesByUsuario(@AuthenticationPrincipal UsuarioPrincipal usuario) {
        Long usuarioId = usuario.id();
        return ResponseEntity.ok(avaliacaoService.findAvaliacaoByUsuario(usuarioId));
    }

    @PostMapping("evento/{id}")
    public ResponseEntity<Void> saveAvaliacao(@AuthenticationPrincipal UsuarioPrincipal usuario, @PathVariable Long id, @RequestBody AvaliacaoRequestDTO avaliacaoRequestDTO) {
        Long usuarioId = usuario.id();
        avaliacaoService.createAvaliacao(usuarioId, id, avaliacaoRequestDTO);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAvaliacao(@AuthenticationPrincipal UsuarioPrincipal usuario, @PathVariable Long id) {
        Long usuarioId = usuario.id();
        avaliacaoService.deleteAvaliacao(usuarioId, id);
        return ResponseEntity.noContent().build();
    }
}
