import { api } from './api';
import { Subcategoria } from '@/types/Subcategoria';

export const buscarSubcategoriasPorCategoria = async (
  categoriaId: number,
): Promise<Subcategoria[]> => {
  const response = await api.get<Subcategoria[]>(`/subcategorias/categoria/${categoriaId}`);
  return response.data;
};
