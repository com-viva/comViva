package com.comviva.service;

import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;

import com.comviva.service.EmailService;

@Service
public class SolicitacaoRecuperacaoSenhaService {

    private final RecuperacaoSenhaService recuperacaoSenhaService;
    private final EmailService emailService;

    public SolicitacaoRecuperacaoSenhaService(
            RecuperacaoSenhaService recuperacaoSenhaService,
            EmailService emailService) {

        this.recuperacaoSenhaService = recuperacaoSenhaService;
        this.emailService = emailService;
    }

    public void solicitarRecuperacao(String email) {
        recuperacaoSenhaService.gerarTokenRecuperacao(email)
                .ifPresent(token -> enviarEmail(email, token));
    }

    private void enviarEmail(String email, String token) {
        try {
            emailService.enviarRecuperacaoSenha(email, token);
        } catch (MailException ex) {
            
        }
    }
}
