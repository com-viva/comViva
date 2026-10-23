package com.comviva.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.comviva.domain.Usuario;
import com.comviva.dto.LoginResponseDTO;
import com.comviva.repository.UsuarioRepository;
import com.comviva.security.JwtService;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponseDTO login(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));

        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new BadCredentialsException("Credenciais inválidas");
        }

        if (!usuario.getAtivo()) {
            throw new BadCredentialsException("Credenciais inválidas");
        }

        String token = jwtService.generateToken(usuario);

        return new LoginResponseDTO(token, "Bearer");
    }
}
