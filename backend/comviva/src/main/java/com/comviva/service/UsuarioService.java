package com.comviva.service;

import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.comviva.domain.Usuario;
import com.comviva.dto.UsuarioRequestDTO;
import com.comviva.dto.UsuarioResponseDTO;
import com.comviva.exception.ConflictException;
import com.comviva.exception.ResourceNotFoundException;
import com.comviva.mapper.UsuarioMapper;
import com.comviva.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private UsuarioRepository usuarioRepository;
    private UsuarioMapper usuarioMapper;
    private PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, UsuarioMapper usuarioMapper, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UsuarioResponseDTO> findAllUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarioMapper.toDto(usuarios);
    }

    public UsuarioResponseDTO findUsuarioById(Long id) {
        Usuario usuario = findUsuarioOrElseThrow(id);
        return usuarioMapper.toDto(usuario);
    }

    public List<UsuarioResponseDTO> findUsuarioByNome(String nome) {
        List<Usuario> usuario = usuarioRepository.findByNome(nome)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        return usuarioMapper.toDto(usuario);
    }

    public void createUsuario(UsuarioRequestDTO usuarioRequestDTO) {
        if (usuarioRepository.existsByEmail(usuarioRequestDTO.email())) {
            throw new ConflictException("Já existe um usuário cadastrado com este email.");
        }

        Usuario usuario = usuarioMapper.toEntity(usuarioRequestDTO);

        String senhaCriptografada = passwordEncoder.encode(usuarioRequestDTO.senha());
        usuario.setSenha(senhaCriptografada);

        usuarioRepository.save(usuario);
    }

    public void updateUsuario(Long id, UsuarioRequestDTO usuarioRequestDTO) {
        Usuario usuario = findUsuarioOrElseThrow(id);

        if (usuarioRequestDTO.email() != null && !usuarioRequestDTO.email().equals(usuario.getEmail())) {
            if (usuarioRepository.existsByEmail(usuarioRequestDTO.email())) {
                throw new ConflictException("Este email já está sendo utilizado por outro usuário.");
            }
        }

        usuarioMapper.updateUsuarioFromDto(usuarioRequestDTO, usuario);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void deactivateUsuario(Long id) {
        Integer usuario = usuarioRepository.deactivateById(id);

        if(usuario == 0) {
            throw new RuntimeException("Usuário nao encontrado");
        }
    }

    private Usuario findUsuarioOrElseThrow(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }
}
