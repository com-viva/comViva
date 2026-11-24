import { api } from './api';
import { Evento } from '@/types/Evento';
import { EventoRequest } from '@/types/EventoRequest';

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

export const buscarEventosPorUsuario = async (usuarioId: number): Promise<Evento[]> => {
  const response = await api.get<Evento[]>(`/eventos/usuario/${usuarioId}`);
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

export const excluirEvento = async (id: number): Promise<void> => {
  await api.delete(`/eventos/${id}`);
};
