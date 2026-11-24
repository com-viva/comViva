import { api } from './api';

export const inscreverEvento = async (eventoId: number): Promise<void> => {
    await api.post(`/inscricoes/evento/${eventoId}`);
};