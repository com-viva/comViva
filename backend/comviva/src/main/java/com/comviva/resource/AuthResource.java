package com.comviva.resource;

import com.comviva.dto.LoginRequestDTO;
import com.comviva.dto.LoginResponseDTO;
import com.comviva.dto.RecuperacaoSenhaRequestDTO;
import com.comviva.dto.RedefinirSenhaRequestDTO;
import com.comviva.service.AuthService;
import com.comviva.service.RecuperacaoSenhaService;
import com.comviva.service.SolicitacaoRecuperacaoSenhaService;
import com.comviva.service.RecuperacaoSenhaRateLimitService;

import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthResource {

    private final AuthService authService;
    private final RecuperacaoSenhaService recuperacaoSenhaService;
    private final SolicitacaoRecuperacaoSenhaService solicitacaoService;
    private final RecuperacaoSenhaRateLimitService rateLimitService;

    public AuthResource(AuthService authService,
            RecuperacaoSenhaService recuperacaoSenhaService,
            SolicitacaoRecuperacaoSenhaService solicitacaoService,
            RecuperacaoSenhaRateLimitService rateLimitService) {
        this.authService = authService;
        this.recuperacaoSenhaService = recuperacaoSenhaService;
        this.solicitacaoService = solicitacaoService;
        this.rateLimitService = rateLimitService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        LoginResponseDTO loginResponseDTO = authService.login(loginRequestDTO.getEmail(), loginRequestDTO.getSenha());
        return ResponseEntity.ok(loginResponseDTO);
    }

    @PostMapping("/esqueci-senha")
    public ResponseEntity<String> solicitarRecuperacao(@Valid @RequestBody RecuperacaoSenhaRequestDTO dto, HttpServletRequest request) {
        boolean isRequisicaoPermitida = rateLimitService.permitirSolicitacao(dto.getEmail(), request.getRemoteAddr());
        if (!isRequisicaoPermitida) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body("Limite de solicitações atingido. Tente novamente mais tarde.");
        }
        solicitacaoService.solicitarRecuperacao(dto.getEmail());
        return ResponseEntity.ok("Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.");
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<String> redefinirSenha(@Valid @RequestBody RedefinirSenhaRequestDTO dto) {
        recuperacaoSenhaService.redefinirSenha(dto.getToken(), dto.getNovaSenha());
        return ResponseEntity.ok("Senha redefinida com sucesso.");
    }
}
