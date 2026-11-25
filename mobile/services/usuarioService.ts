import { UsuarioRequest, UsuarioUpdateRequest } from '@/types/UsuarioRequest';
import { api } from './api';
import { Usuario } from '@/types/Usuario';

export const getUsuarioLogado = async (): Promise<Usuario> => {
    const response = await api.get<Usuario>('/usuarios/me');
    return response.data;
};

export const getUsuarioById = async (id: number): Promise<Usuario> => {
    const response = await api.get<Usuario>(`/usuarios/${id}`);
    return response.data;
};

export const criarUsuario = async (dados: UsuarioRequest): Promise<void> => {
    await api.post('/usuarios', dados);
};

export const atualizarUsuario = async (id: number, dados: UsuarioUpdateRequest): Promise<void> => {
    await api.patch(`/usuarios/${id}`, dados);
}

export const desativarUsuario = async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
}