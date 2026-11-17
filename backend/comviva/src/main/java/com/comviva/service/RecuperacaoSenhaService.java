
package com.comviva.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.comviva.domain.TokenRecuperacaoSenha;
import com.comviva.domain.Usuario;
import com.comviva.exception.BusinessRuleException;
import com.comviva.repository.TokenRecuperacaoSenhaRepository;
import com.comviva.repository.UsuarioRepository;

@Service
public class RecuperacaoSenhaService {

    private static final int MINUTOS_EXPIRACAO = 15;
    private static final int TAMANHO_TOKEN_BYTES = 32;
    private static final String ALGORITMO_HASH = "SHA-256";
    private static final String MENSAGEM_TOKEN_INVALIDO = "Token inválido ou expirado.";

    private final SecureRandom secureRandom = new SecureRandom();

    private final UsuarioRepository usuarioRepository;
    private final TokenRecuperacaoSenhaRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    public RecuperacaoSenhaService(
            UsuarioRepository usuarioRepository,
            TokenRecuperacaoSenhaRepository tokenRepository,
            PasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Optional<String> gerarTokenRecuperacao(String email) {
        Optional<Usuario> usuarioEncontrado = usuarioRepository.findByEmail(email);

        if (usuarioEncontrado.isEmpty()) {
            return Optional.empty();
        }

        Usuario usuario = usuarioEncontrado.get();

        if (!Boolean.TRUE.equals(usuario.getAtivo())) {
            return Optional.empty();
        }

        invalidarTokensAnteriores(usuario.getId());

        String token = gerarTokenSeguro();

        TokenRecuperacaoSenha recuperacao = new TokenRecuperacaoSenha();

        recuperacao.setUsuario(usuario);
        recuperacao.setTokenHash(calcularHash(token));
        recuperacao.setDataExpiracao(
                LocalDateTime.now().plusMinutes(MINUTOS_EXPIRACAO));
        recuperacao.setUtilizado(false);

        tokenRepository.save(recuperacao);

        return Optional.of(token);
    }

    @Transactional
    public void redefinirSenha(String token, String novaSenha) {
        if (StringUtils.isBlank(token)) {
            throw new BusinessRuleException(MENSAGEM_TOKEN_INVALIDO);
        }

        if (StringUtils.isBlank(novaSenha) || novaSenha.length() < 6) {
            throw new BusinessRuleException("A senha deve ter no mínimo 6 caracteres.");
        }

        String tokenHash = calcularHash(token);

        TokenRecuperacaoSenha recuperacao = tokenRepository.findTokenValidoParaUso(tokenHash)
                .orElseThrow(() -> new BusinessRuleException(MENSAGEM_TOKEN_INVALIDO));

        validarExpiracao(recuperacao);

        Usuario usuario = recuperacao.getUsuario();

        if (!Boolean.TRUE.equals(usuario.getAtivo())) {
            throw new BusinessRuleException(
                    MENSAGEM_TOKEN_INVALIDO);
        }

        usuario.setSenha(passwordEncoder.encode(novaSenha));

        recuperacao.setUtilizado(true);

        invalidarTokensAnteriores(usuario.getId());

        usuarioRepository.save(usuario);
    }

    private String gerarTokenSeguro() {
        byte[] bytes = new byte[TAMANHO_TOKEN_BYTES];
        secureRandom.nextBytes(bytes);

        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String calcularHash(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance(ALGORITMO_HASH);

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8));

            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Algoritmo SHA-256 indisponível.", e);
        }
    }

    private void validarExpiracao(TokenRecuperacaoSenha recuperacao) {
        if (!recuperacao.getDataExpiracao()
                .isAfter(LocalDateTime.now())) {
            throw new BusinessRuleException(MENSAGEM_TOKEN_INVALIDO);
        }
    }

    private void invalidarTokensAnteriores(Long usuarioId) {
        List<TokenRecuperacaoSenha> tokens = tokenRepository.findByUsuarioIdAndUtilizadoFalse(usuarioId);

        for (TokenRecuperacaoSenha token : tokens) {
            token.setUtilizado(true);
        }
        tokenRepository.saveAll(tokens);
    }
}
