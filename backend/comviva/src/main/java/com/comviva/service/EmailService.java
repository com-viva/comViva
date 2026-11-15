package com.comviva.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String remetente;
    private final String frontendUrl;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${comviva.mail.remetente}") String remetente,
            @Value("${comviva.frontend.url}") String frontendUrl) {

        this.mailSender = mailSender;
        this.remetente = remetente;
        this.frontendUrl = frontendUrl;
    }

    public void enviarRecuperacaoSenha(String email, String token) {
        String linkRecuperacao = UriComponentsBuilder.fromUriString(frontendUrl).path("/redefinir-senha")
                .queryParam("token", token).build().encode().toUriString();

        SimpleMailMessage mensagem = new SimpleMailMessage();

        mensagem.setFrom(remetente);
        mensagem.setTo(email);
        mensagem.setSubject("ComViva - Recuperação de senha");

        mensagem.setText("""
                Olá!

                Recebemos uma solicitação para redefinir
                a senha da sua conta no ComViva.

                Para cadastrar uma nova senha, acesse:

                %s

                Este link é válido por 15 minutos
                e pode ser utilizado apenas uma vez.

                Se você não solicitou a recuperação,
                ignore esta mensagem.

                Equipe ComViva
                """.formatted(linkRecuperacao));

        mailSender.send(mensagem);
    }
}
