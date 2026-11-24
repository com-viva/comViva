import { api } from './api';
import { Inscricao } from '@/types/Inscricao';

export const inscreverEvento = async (eventoId: number): Promise<void> => {
    await api.post(`/inscricoes/evento/${eventoId}`);
};

export const inscricoesUsuario = async (): Promise<Inscricao[]> => {
    const response = await api.get<Inscricao[]>(`/inscricoes/usuario`);
    return response.data;
}

export const cancelarInscricao = async (id: number): Promise<void> => {
    await api.patch(`/inscricoes/${id}`);
}