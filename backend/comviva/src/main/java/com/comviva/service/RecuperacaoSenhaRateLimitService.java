package com.comviva.service;

import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class RecuperacaoSenhaRateLimitService {

    private static final Duration JANELA = Duration.ofMinutes(15);

    private static final int LIMITE_EMAIL = 3;
    private static final int LIMITE_IP = 20;

    private final Map<String, ControleSolicitacao> controles = new ConcurrentHashMap<>();

    public boolean permitirSolicitacao(String email, String ip) {
        String emailNormalizado = email.trim().toLowerCase(Locale.ROOT);

        String chaveEmail = "email:" + emailNormalizado;
        String chaveIp = "ip:" + ip;

        Instant agora = Instant.now();
        synchronized (this) {
            if (!possuiLimite(chaveEmail, LIMITE_EMAIL, agora)
                    || !possuiLimite(chaveIp, LIMITE_IP, agora)) {
                return false;
            }

            registrar(chaveEmail, agora);
            registrar(chaveIp, agora);

            return true;
        }
    }

    private boolean possuiLimite(String chave, int limite, Instant agora) {
        ControleSolicitacao controle = controles.get(chave);

        return controle == null || !agora.isBefore(controle.inicio().plus(JANELA))
                || controle.quantidade() < limite;
    }

    private void registrar(String chave, Instant agora) {
        ControleSolicitacao controle = controles.get(chave);

        if (controle == null || !agora.isBefore(controle.inicio().plus(JANELA))) {
            controles.put(chave, new ControleSolicitacao(1, agora));
            return;
        }

        controles.put(chave, new ControleSolicitacao(controle.quantidade() + 1, controle.inicio()));
    }

    @Scheduled(fixedDelay = 900000)
    public void limparControlesExpirados() {
        Instant agora = Instant.now();

        controles.entrySet().removeIf(entry -> !agora.isBefore(entry.getValue().inicio().plus(JANELA)));
    }

    private record ControleSolicitacao(int quantidade, Instant inicio) {}
}
