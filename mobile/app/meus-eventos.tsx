import { useEventos } from '@/hooks/useEventos';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/generic-button';
import { Colors } from '@/constants/Colors';
import { Evento } from '@/types/Evento';
import { router } from 'expo-router';
import { StatusEvento } from '@/types/StatusEvento';
import { Input } from '@/components/generic-input';

export default function MeusEventosScreen() {
    const { eventos, loading, buscarPorUsuario, cancelar, concluir } = useEventos();
    const [pesquisa, setPesquisa] = useState('');
    const [pesquisaDebounced, setPesquisaDebounced] = useState('');

    useFocusEffect(
        useCallback(() => {
            buscarPorUsuario().catch(() => { });
        }, [buscarPorUsuario])
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPesquisaDebounced(pesquisa.trim());
        }, 500);

        return () => clearTimeout(timeout);
    }, [pesquisa]);

    function editarEvento(id: number) {
        router.push({
            pathname: '/(tabs)/evento-update',
            params: { id: String(id) },
        });
    }

    function confirmarCancelamento(evento: Evento) {
        Alert.alert(
            'Cancelar evento',
            `Deseja realmente cancelar "${evento.nome}"?`,
            [
                { text: 'Voltar', style: 'cancel' },
                {
                    text: 'Cancelar evento',
                    style: 'destructive',
                    onPress: () => cancelarEvento(evento.id),
                },
            ]
        );
    }

    async function concluirEvento(evento: Evento) {
        try {
            await concluir(evento.id);

            Alert.alert('Sucesso', 'Evento concluido com sucesso!');
            await buscarPorUsuario();
        } catch {
            Alert.alert('Erro', 'Não foi possível concluir o evento.');
        }
    }

    async function cancelarEvento(id: number) {
        try {
            await cancelar(id);

            Alert.alert('Sucesso', 'Evento cancelado com sucesso!');
            await buscarPorUsuario();
        } catch {
            Alert.alert('Erro', 'Não foi possível cancelar o evento.');
        }
    }

    const formatarData = (dataHora: string) => {
        const data = new Date(dataHora);

        return data.toLocaleDateString('pt-BR');
    };

    const formatarHora = (dataHora: string) => {
        const data = new Date(dataHora);

        return data.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    function obterEstiloCard(status: string) {
        switch (status) {
            case 'CANCELADO':
                return styles.cardCancelado;

            case 'CONCLUIDO':
            case 'EM_ANDAMENTO':
                return styles.cardFinalizado;

            default:
                return styles.cardAgendado;
        }
    }

    const statusConfig: Record<StatusEvento, {
        texto: string;
        cor: string;
        corTexto: string;
    }> = {
        AGENDADO: {
            texto: 'Agendado',
            cor: '#FFF0D9',
            corTexto: '#C77700',
        },
        EM_ANDAMENTO: {
            texto: 'Em andamento',
            cor: '#E0F4E5',
            corTexto: '#23843D',
        },
        CONCLUIDO: {
            texto: 'Concluído',
            cor: '#E0F4E5',
            corTexto: '#23843D',
        },
        CANCELADO: {
            texto: 'Cancelado',
            cor: '#FCE4E4',
            corTexto: '#D32F2F',
        },
    };

    function renderEvento({ item }: { item: Evento }) {
        const agendado = item.status === 'AGENDADO';
        const andamento = item.status === 'EM_ANDAMENTO';

        return (
            <Pressable onPress={() => goToInscritos(item.id)}>
                <View style={[styles.card, obterEstiloCard(item.status)]}>
                    <Text style={styles.nomeEvento}>{item.nome}</Text>

                    <Text style={styles.dataEvento}>
                        {formatarData(item.dataHora)} {formatarHora(item.dataHora)}
                    </Text>

                    <Text style={styles.endereco}>{item.endereco}</Text>

                    <View style={styles.badgeContainer}>
                        <View
                            style={[
                                styles.badge,
                                {
                                    backgroundColor: statusConfig[item.status as StatusEvento].cor,
                                    borderColor: statusConfig[item.status as StatusEvento].corTexto,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.badgeTexto,
                                    { color: statusConfig[item.status as StatusEvento].corTexto },
                                ]}
                            >
                                {statusConfig[item.status as StatusEvento].texto}
                            </Text>
                        </View>
                    </View>

                    {agendado && (
                        <View style={styles.acoes}>
                            <View style={styles.botao}>
                                <Button
                                    title="Editar"
                                    variant="outline"
                                    onPress={() => editarEvento(item.id)}
                                />
                            </View>

                            <View style={styles.botao}>
                                <Button
                                    title="Cancelar"
                                    variant="filled"
                                    onPress={() => confirmarCancelamento(item)}
                                />
                            </View>
                        </View>
                    )}

                    {andamento && (
                        <View style={styles.acoes}>
                            <View style={styles.botao}>
                                <Button
                                    title="Concluir"
                                    variant="filled"
                                    onPress={() => concluirEvento(item)}
                                />
                            </View>
                        </View>
                    )}

                </View>
            </Pressable>
        );
    }

    function goToInscritos(id: number) {
        router.push({
            pathname: '/inscritos-evento',
            params: { id: id.toString() }
        });
    }

    const eventosFiltrados = eventos.filter((item) =>
        item.nome.toLowerCase().includes(pesquisaDebounced.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Meus eventos</Text>

            <View style={styles.filtros}>
                <Input
                    label="Pesquisar"
                    value={pesquisa}
                    onChangeText={setPesquisa}
                    returnKeyType="search"
                    autoCapitalize="none"
                />
            </View>

            {loading && eventos.length === 0 ? (
                <ActivityIndicator
                    size="large"
                    color={Colors.primary.end}
                />
            ) : (
                <FlatList
                    data={eventosFiltrados}
                    keyExtractor={item => String(item.id)}
                    renderItem={renderEvento}
                    contentContainerStyle={styles.lista}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 16 }} />
                    )}
                    refreshing={loading}
                    onRefresh={() => buscarPorUsuario()}
                    ListEmptyComponent={
                        <Text style={styles.mensagem}>
                            {pesquisaDebounced
                                ? 'Nenhum evento encontrado.'
                                : 'Você ainda não criou nenhum evento.'}
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
        marginBottom: 20,
        color: Colors.text.primary,
        textTransform: 'uppercase',
    },

    filtros: {
        gap: 8,
        marginBottom: 15,
    },

    lista: {
        paddingBottom: 20,
    },

    card: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        gap: 8,
    },

    cardAgendado: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.text.secondary,
    },

    cardCancelado: {
        backgroundColor: Colors.secondary,
        borderColor: '#D32F2F',
    },

    cardFinalizado: {
        backgroundColor: Colors.secondary,
        borderColor: '#23843D',
    },

    nomeEvento: {
        fontSize: 17,
        fontWeight: 'bold',
        color: Colors.text.secondary,
    },

    dataEvento: {
        fontSize: 14,
        color: Colors.text.secondary,
    },

    endereco: {
        fontSize: 14,
        color: Colors.text.secondary,
    },

    status: {
        fontSize: 13,
        fontWeight: 'bold',
        color: Colors.text.primary,
    },

    acoes: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },

    botao: {
        flex: 1,
    },

    mensagem: {
        textAlign: 'center',
        marginTop: 30,
        color: Colors.text.secondary,
    },

    badgeContainer: {
        flexShrink: 0,
        alignItems: 'flex-end',
    },

    badge: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },

    badgeTexto: {
        fontSize: 10,
        fontWeight: '600',
    },
});
