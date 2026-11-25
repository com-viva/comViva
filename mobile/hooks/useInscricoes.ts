
import { useCallback, useState } from 'react';
import { inscreverEvento, inscricoesUsuario, cancelarInscricao as cancelarInscricaoService, inscricoesEvento } from '@/services/inscricaoService';
import { Inscricao } from '@/types/Inscricao';

export function useInscricoes() {
    const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
    const [inscricao, setInscricao] = useState<Inscricao | null>(null);

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

    const criarInscricao = useCallback(
        (eventoId: number) =>
            executar(() =>
                inscreverEvento(eventoId),
                'Não foi possível realizar a inscrição.'
            ),
        [executar]
    );

    const buscarPorUsuario = useCallback(
        () =>
            executar(async () => {
                const dados = await inscricoesUsuario();
                setInscricoes(dados);
                return dados;
            }, 'Não foi possível carregar inscrições.'),
        [executar]
    );

    const cancelar = useCallback(
        (id: number) =>
            executar(() =>
                cancelarInscricaoService(id),
                'Não foi possível cancelar a inscrição.'
            ),
        [executar]
    );

    const buscarPorEvento = useCallback(
        (eventoId: number) =>
            executar(async () => {
                const dados = await inscricoesEvento(eventoId);
                setInscricoes(dados);
                return dados;
            }, 'Não foi possível carregar inscrições.'),
        [executar]
    );

    return { inscricoes, inscricao, loading, error, criarInscricao, buscarPorUsuario, cancelar, buscarPorEvento };
}
