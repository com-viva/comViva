import { api } from './api';
import { Categoria } from '@/types/Categoria';

export const buscarCategorias = async (): Promise<Categoria[]> => {
  const response = await api.get<Categoria[]>('/categorias');
  return response.data;
};
