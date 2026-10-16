package com.comviva.resource;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.comviva.dto.Atualizar;
import com.comviva.dto.Criar;
import com.comviva.dto.UsuarioRequestDTO;
import com.comviva.dto.UsuarioResponseDTO;
import com.comviva.service.UsuarioService;


@RestController  
@RequestMapping ("/api/usuarios")
public class UsuarioResource {

    private final UsuarioService usuarioService;
        
    public UsuarioResource(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }


    @GetMapping ("")
    public ResponseEntity<List<UsuarioResponseDTO>> getAllUsuarios() {
        List<UsuarioResponseDTO> usuarios = usuarioService.findAllUsuarios();
        return ResponseEntity.status(HttpStatus.OK).body(usuarios);
    }

    @GetMapping ("/{id}")
    public ResponseEntity<UsuarioResponseDTO> getUsuarioById(@PathVariable Long id) {
        UsuarioResponseDTO usuarioResponseDTO = usuarioService.findUsuarioById(id);
        return ResponseEntity.status(HttpStatus.OK).body(usuarioResponseDTO);
    }

    @PostMapping ("")
    public ResponseEntity<Void> saveUsuario(@Validated(Criar.class) @RequestBody UsuarioRequestDTO usuarioRequestDTO) {
        usuarioService.createUsuario(usuarioRequestDTO);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PatchMapping  ("/{id}")
    public ResponseEntity<Void> updateUsuario(@PathVariable Long id, @Validated(Atualizar.class) @RequestBody UsuarioRequestDTO usuarioRequestDTO) {
        usuarioService.updateUsuario(id, usuarioRequestDTO);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping ("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable  Long id) {
        usuarioService.deactivateUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
