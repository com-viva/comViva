package com.comviva.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.comviva.service.EventoService;

@Component
public class EventoScheduler {

    private final EventoService eventoService;

    public EventoScheduler(EventoService eventoService) {
        this.eventoService = eventoService;
    }

    @Scheduled(fixedRate = 60000)
    public void startEventos() {
        eventoService.startEventos();
    }

    @Scheduled(fixedRate = 60000)
    public void concludeEventoByDataHoraFim() {
        eventoService.concludeEventoByDataHoraFim();
    }
}