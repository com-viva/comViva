
import { useCallback, useState } from 'react';
import { Evento } from '@/types/Evento';
import { EventoRequest } from '@/types/EventoRequest';
import {
  buscarEventos,
  buscarEventoPorId,
  buscarEventosPorUsuario,
  criarEvento,
  atualizarEvento,
  concluirEvento,
  excluirEvento,
  EventoFiltros,
} from '@/services/eventoService';

export function useEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executar = useCallback(async <T,>(acao: () => Promise<T>, mensagemErro: string): Promise<T> => {
    try {
      setLoading(true);
      setError(null);

      return await acao();
    } catch (err) {
      setError(mensagemErro);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const carregarEventos = useCallback(
    (filtros?: EventoFiltros) =>
      executar(async () => {
        const dados = await buscarEventos(filtros);
        setEventos(dados);
        return dados;
      }, 'Não foi possível carregar os eventos.'),
    [executar]
  );

  const buscarPorId = useCallback(
    (id: number) =>
      executar(async () => {
        const dados = await buscarEventoPorId(id);
        setEvento(dados);
        return dados;
      }, 'Não foi possível buscar o evento.'),
    [executar]
  );

  const buscarPorUsuario = useCallback(
    (usuarioId: number) =>
      executar(async () => {
        const dados = await buscarEventosPorUsuario(usuarioId);
        setEventos(dados);
        return dados;
      }, 'Não foi possível carregar seus eventos.'),
    [executar]
  );

  const criar = useCallback(
    (dados: EventoRequest) =>
      executar(
        () => criarEvento(dados),
        'Não foi possível criar o evento.'
      ),
    [executar]
  );

  const atualizar = useCallback(
    (id: number, dados: EventoRequest) =>
      executar(
        () => atualizarEvento(id, dados),
        'Não foi possível atualizar o evento.'
      ),
    [executar]
  );

  const concluir = useCallback(
    (id: number) =>
      executar(
        () => concluirEvento(id),
        'Não foi possível concluir o evento.'
      ),
    [executar]
  );

  const excluir = useCallback(
    (id: number) =>
      executar(
        () => excluirEvento(id),
        'Não foi possível excluir o evento.'
      ),
    [executar]
  );

  return { eventos, evento, loading, error, carregarEventos, buscarPorId, buscarPorUsuario, criar, atualizar, concluir, excluir };
}
