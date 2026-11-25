
import { Input } from '@/components/generic-input';
import { Colors } from '@/constants/Colors';
import { useEventos } from '@/hooks/useEventos';
import { useInscricoes } from '@/hooks/useInscricoes';
import { useUsuarios } from '@/hooks/useUsuarios';
import { Evento } from '@/types/Evento';
import { UsuarioInscrito } from '@/types/UsuarioInscrito';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';


export default function InscritosEventoScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const { buscarPorEvento } = useInscricoes();
    const { buscarPorId: buscarUsuarioPorId } = useUsuarios();
    const { buscarPorId: buscarEventoPorId } = useEventos();

    const [inscricoes, setInscricoes] = useState<UsuarioInscrito[]>([]);
    const [pesquisa, setPesquisa] = useState('');
    const [pesquisaDebounced, setPesquisaDebounced] = useState('');
    const [loading, setLoading] = useState(false);

    const [evento, setEvento] = useState<Evento>();

    const carregarEvento = async () => {
        const resultado = await buscarEventoPorId(Number(id));
        setEvento(resultado);
    };

    useEffect(() => {
        carregarEvento();
    }, [id]);

    const carregarInscritos = useCallback(async () => {
        try {
            setLoading(true);

            const dados = await buscarPorEvento(Number(id));

            const usuariosInscritos = await Promise.all(
                dados.map(async (item) => {
                    const usuario = await buscarUsuarioPorId(item.usuarioId);

                    return {
                        id: item.id,
                        status: item.status,
                        usuario
                    };
                })
            );

            setInscricoes(usuariosInscritos);
        } catch (error) {
            console.error('Erro ao carregar inscritos:', error);
        } finally {
            setLoading(false);
        }
    }, [id, buscarPorEvento]);

    useFocusEffect(
        useCallback(() => {
            carregarInscritos();
        }, [carregarInscritos])
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPesquisaDebounced(pesquisa.trim());
        }, 500);

        return () => clearTimeout(timeout);
    }, [pesquisa]);

    const inscritosFiltrados = useMemo(() => {
        return [...inscricoes]
            .filter((item) =>
                item.usuario.nome
                    .toLowerCase()
                    .includes(pesquisaDebounced.toLowerCase())
            )
            .sort((a, b) => {
                if (a.status === 'CANCELADA' && b.status !== 'CANCELADA') {
                    return 1;
                }

                if (a.status !== 'CANCELADA' && b.status === 'CANCELADA') {
                    return -1;
                }

                return a.usuario.nome.localeCompare(b.usuario.nome);
            });
    }, [inscricoes, pesquisaDebounced]);

    function renderInscrito({ item }: { item: UsuarioInscrito }) {
        const cancelado = item.status === 'CANCELADA';

        return (
            <View style={[
                styles.card,
                cancelado && styles.cardCancelado
            ]}>
                {item.usuario.foto ? (
                    <Image
                        source={{ uri: item.usuario.foto }}
                        style={[
                            styles.foto,
                            cancelado && styles.fotoCancelada
                        ]}
                    />
                ) : (
                    <View style={[
                        styles.fotoPlaceholder,
                        cancelado && styles.fotoCancelada
                    ]}>
                        <AntDesign
                            name="user"
                            size={48}
                            color={Colors.text.secondary}
                        />
                    </View>
                )}

                <View style={styles.infoUsuario}>
                    <View style={styles.nomeContainer}>
                        <Text style={[
                            styles.nome,
                            cancelado && styles.textoCancelado
                        ]}>
                            {item.usuario.nome}
                        </Text>

                        {cancelado && (
                            <View style={styles.badgeCancelado}>
                                <Text style={styles.badgeTexto}>
                                    Cancelado
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>
                Inscritos no evento
            </Text>

            <Text style={styles.tituloEvento}>
                {evento?.nome}
            </Text>

            <View style={styles.filtros}>
                <Input
                    label="Pesquisar usuário"
                    value={pesquisa}
                    onChangeText={setPesquisa}
                    returnKeyType="search"
                    autoCapitalize="none"
                />
            </View>

            {loading && inscricoes.length === 0 ? (
                <ActivityIndicator
                    size="large"
                    color={Colors.primary.end}
                />
            ) : (
                <FlatList
                    data={inscritosFiltrados}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderInscrito}
                    contentContainerStyle={styles.lista}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 12 }} />
                    )}
                    refreshing={loading}
                    onRefresh={carregarInscritos}
                    ListEmptyComponent={
                        <Text style={styles.mensagem}>
                            {pesquisaDebounced
                                ? 'Nenhum usuário encontrado.'
                                : 'Ainda não existem inscritos neste evento.'}
                        </Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
        paddingTop: 12,
    },

    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: Colors.text.primary,
        textTransform: 'uppercase',
    },

    tituloEvento: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary.end,
    },

    filtros: {
        gap: 8,
        marginBottom: 15,
    },

    lista: {
        paddingBottom: 20,
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.secondary,
        borderRadius: 12,
        padding: 12,
        gap: 14,
        borderWidth: 1,
        borderColor: Colors.text.secondary,
    },

    cardCancelado: {
        backgroundColor: '#fdebeb',
        borderColor: '#D32F2F',        
    },

    foto: {
        width: 58,
        height: 58,
        borderRadius: 29,
    },

    fotoPlaceholder: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },

    fotoCancelada: {
        opacity: 0.5,
    },

    infoUsuario: {
        flex: 1,
        justifyContent: 'center',
    },

    nomeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
    },

    nome: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text.primary,
        flexShrink: 1,
    },

    textoCancelado: {
        color: '#888888',
    },

    badgeCancelado: {
        backgroundColor: '#FCE4E4',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D32F2F',
        paddingHorizontal: 9,
        paddingVertical: 4,
    },

    badgeTexto: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#666666',
    },

    mensagem: {
        textAlign: 'center',
        marginTop: 30,
        color: Colors.text.secondary,
    },
});
