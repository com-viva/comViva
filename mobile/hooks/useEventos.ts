import { useCallback, useState } from 'react';
import { Evento } from '@/types/Evento';
import { EventoRequest } from '@/types/EventoRequest';
import { buscarEventos, buscarEventoPorId, buscarEventosPorUsuario, criarEvento, atualizarEvento, concluirEvento, excluirEvento, EventoFiltros } from '@/services/eventoService';

export function useEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [evento, setEvento] = useState<Evento | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarEventos = useCallback(async (filtros?: EventoFiltros) => {
    try {
      setLoading(true);
      setError(null);

      const dados = await buscarEventos(filtros);

      setEventos(dados);
    } catch (err) {
      setError('Não foi possível carregar os eventos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarPorId = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const dados = await buscarEventoPorId(id);

      setEvento(dados);

      return dados;
    } catch (err) {
      setError('Não foi possível buscar o evento.');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarPorUsuario = useCallback(async (usuarioId: number) => {
    try {
      setLoading(true);
      setError(null);

      const dados = await buscarEventosPorUsuario(usuarioId);

      setEventos(dados);
    } catch (err) {
      setError('Não foi possível carregar seus eventos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const criar = useCallback(async (dados: EventoRequest) => {
    try {
      setLoading(true);
      setError(null);

      await criarEvento(dados);
    } catch (err) {
      setError('Não foi possível criar o evento.');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizar = useCallback(async (id: number, dados: EventoRequest) => {
    try {
      setLoading(true);
      setError(null);

      await atualizarEvento(id, dados);
    } catch (err) {
      setError('Não foi possível atualizar o evento.');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const concluir = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      await concluirEvento(id);
    } catch (err) {
      setError('Não foi possível concluir o evento.');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const excluir = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      await excluirEvento(id);
    } catch (err) {
      setError('Não foi possível excluir o evento.');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { eventos, evento, loading, error, carregarEventos, buscarPorId, buscarPorUsuario, criar, atualizar, concluir, excluir };
}
