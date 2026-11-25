import { DescricaoRequest } from '@/types/DescricaoRequest';
import { api } from './api';
import { Evento } from '@/types/Evento';
import { EventoRequest } from '@/types/EventoRequest';
import { Descricao } from '@/types/Descricao';

export interface EventoFiltros {
  nome?: string;
  categoriaId?: number;
  subcategoriaId?: number;
}

export const buscarEventos = async (filtros?: EventoFiltros): Promise<Evento[]> => {
  const response = await api.get<Evento[]>('/eventos', {params: filtros});
  return response.data;
};

export const buscarEventoPorId = async (id: number): Promise<Evento> => {
  const response = await api.get<Evento>(`/eventos/${id}`);
  return response.data;
};

export const buscarEventosPorUsuario = async (): Promise<Evento[]> => {
  const response = await api.get<Evento[]>('/eventos/usuario');
  return response.data;
};

export const criarEvento = async (dados: EventoRequest): Promise<void> => {
  await api.post('/eventos', dados);
};

export const atualizarEvento = async (id: number, dados: EventoRequest): Promise<void> => {
  await api.patch(`/eventos/${id}`, dados);
};

export const concluirEvento = async (id: number): Promise<void> => {
  await api.patch(`/eventos/${id}/conclude`);
};

export const cancelarEvento = async (id: number): Promise<void> => {
  await api.delete(`/eventos/${id}`);
};

export const gerarDescricao = async (dados: DescricaoRequest): Promise<Descricao> => {
  const response = await api.post(`/eventos/gerar-descricao`, dados);
  return response.data;
}
