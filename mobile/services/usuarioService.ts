import { api } from './api';
import { Usuario } from '@/types/Usuario';

export const getUsuarioLogado = async (): Promise<Usuario> => {
    const response = await api.get<Usuario>('/usuarios/me');
    return response.data;
};