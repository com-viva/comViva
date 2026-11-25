import { useCallback, useState } from 'react';
import { Usuario } from '@/types/Usuario';
import { UsuarioRequest, UsuarioUpdateRequest } from '@/types/UsuarioRequest';
import { getUsuarioLogado, criarUsuario, atualizarUsuario, desativarUsuario } from '@/services/usuarioService';

export function useUsuarios() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const executar = useCallback(async <T,>(
        acao: () => Promise<T>,
        mensagemErro: string
    ): Promise<T> => {
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

    const carregarUsuarioLogado = useCallback(
        () => executar(async () => {
            const dados = await getUsuarioLogado();
            setUsuario(dados);
            return dados;
        }, 'Não foi possível carregar os dados do usuário.'),
        [executar]
    );

    const criar = useCallback(
        (dados: UsuarioRequest) =>
            executar(
                () => criarUsuario(dados),
                'Não foi possível criar o usuário.'
            ),
        [executar]
    );

    const atualizar = useCallback(
        (id: number, dados: UsuarioUpdateRequest) =>
            executar(
                () => atualizarUsuario(id, dados),
                'Não foi possível atualizar o usuário.'
            ),
        [executar]
    );

    const desativar = useCallback(
        (id: number) =>
            executar(
                () => desativarUsuario(id),
                'Não foi possível desativar o usuário.'
            ),
        [executar]
    );

    return { usuario, loading, error, carregarUsuarioLogado, criar, atualizar, desativar };
}