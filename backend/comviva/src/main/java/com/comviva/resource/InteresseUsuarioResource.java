package com.comviva.resource;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.comviva.dto.InteresseUsuarioRequestDTO;
import com.comviva.dto.InteresseUsuarioResponseDTO;
import com.comviva.security.UsuarioPrincipal;
import com.comviva.service.InteresseUsuarioService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController 
@RequestMapping("api/interesses") 
public class InteresseUsuarioResource {

    private final InteresseUsuarioService interesseUsuarioService;
    
    public InteresseUsuarioResource(InteresseUsuarioService interesseUsuarioService) {
        this.interesseUsuarioService = interesseUsuarioService;
    }


    @GetMapping("")
    public ResponseEntity<List<InteresseUsuarioResponseDTO>> getInteressesUsuario(@AuthenticationPrincipal UsuarioPrincipal usuario) {
        Long usuarioId = usuario.id();
        return ResponseEntity.ok(interesseUsuarioService.findInteressesByUsuario(usuarioId));
    }
    
    @PostMapping("")
    public ResponseEntity<Void> saveInteresse(@AuthenticationPrincipal UsuarioPrincipal usuario, @RequestBody InteresseUsuarioRequestDTO interesseDTO) {
        Long usuarioId = usuario.id();
        interesseUsuarioService.createInteresse(interesseDTO, usuarioId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInteresse(@AuthenticationPrincipal UsuarioPrincipal usuario, @PathVariable Long id) {
        Long usuarioId = usuario.id();
        interesseUsuarioService.deleteInteresseUsuario(id, usuarioId);
        return ResponseEntity.noContent().build();
    } 
}
