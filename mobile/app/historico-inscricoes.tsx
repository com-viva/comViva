
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/generic-button';
import { Input } from '@/components/generic-input';
import { Colors } from '@/constants/Colors';
import { useInscricoes } from '@/hooks/useInscricoes';
import { buscarEventoPorId } from '@/services/eventoService';
import { Evento } from '@/types/Evento';
import { StatusEvento } from '@/types/StatusEvento';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import type { ComponentType } from 'react';
import type { MaskedViewProps } from '@react-native-masked-view/masked-view';

interface EventoHistorico {
    evento: Evento;
    inscricaoId: number;
    statusInscricao: string;
}

export default function HistoricoInscricoesScreen() {
    const {
        error,
        buscarPorUsuario,
        cancelar,
    } = useInscricoes();

    const [eventos, setEventos] = useState<EventoHistorico[]>([]);
    const [pesquisa, setPesquisa] = useState('');
    const [pesquisaDebounced, setPesquisaDebounced] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const carregarHistorico = useCallback(async () => {
        try {
            setCarregando(true);

            const dados = await buscarPorUsuario();

            const eventosHistorico = await Promise.all(
                dados.map(async (item) => {
                    const evento = await buscarEventoPorId(item.eventoId);

                    return {
                        evento,
                        inscricaoId: item.id,
                        statusInscricao: item.status,
                    };
                })
            );

            setEventos(eventosHistorico);
        } catch (err) {
            console.error('Erro ao carregar histórico:', err);
        } finally {
            setCarregando(false);
        }
    }, [buscarPorUsuario]);

    useFocusEffect(
        useCallback(() => {
            carregarHistorico();
        }, [carregarHistorico])
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPesquisaDebounced(pesquisa.trim());
        }, 500);

        return () => clearTimeout(timeout);
    }, [pesquisa]);

    const atualizarHistorico = async () => {
        try {
            setRefreshing(true);
            await carregarHistorico();
        } finally {
            setRefreshing(false);
        }
    };

    const formatarData = (dataHora: string) => {
        return new Date(dataHora).toLocaleDateString('pt-BR');
    };

    const formatarHora = (dataHora: string) => {
        return new Date(dataHora).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const statusConfig: Record<StatusEvento,
        {
            texto: string;
            cor: string;
            corTexto: string;
        }
    > = {
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

    async function confirmarCancelamento(inscricaoId: number) {
        Alert.alert(
            'Cancelar inscrição',
            'Deseja realmente cancelar sua inscrição neste evento?',
            [
                {
                    text: 'Voltar',
                    style: 'cancel',
                },
                {
                    text: 'Cancelar inscrição',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await cancelar(inscricaoId);

                            Alert.alert(
                                'Sucesso',
                                'Inscrição cancelada com sucesso!'
                            );

                            await carregarHistorico();
                        } catch (err) {
                            console.error('Erro ao cancelar inscrição:', err);

                            Alert.alert(
                                'Erro',
                                'Não foi possível cancelar sua inscrição.'
                            );
                        }
                    },
                },
            ]
        );
    }


    function renderInscricao({ item }: { item: EventoHistorico }) {
        const TypedMaskedView = MaskedView as ComponentType<MaskedViewProps>;

        const agendado = item.evento.status === 'AGENDADO';
        const cancelada = item.statusInscricao === 'CANCELADA';
        const statusEvento = statusConfig[item.evento.status];

        const podeCancelar =
            item.statusInscricao === 'REALIZADA' &&
            item.evento.status === 'AGENDADO';

        const conteudoCard = (
            <View
                style={[
                    styles.card,
                    cancelada && styles.cardApagado,
                ]}
            >
                <View style={styles.badgeContainer}>
                    <View
                        style={[
                            styles.badgeEvento,
                            { backgroundColor: statusEvento.cor },
                            { borderColor: statusEvento.corTexto },
                        ]}
                    >
                        <Text
                            style={[
                                styles.badgeTexto,
                                { color: statusEvento.corTexto },
                            ]}
                        >
                            {statusEvento.texto}
                        </Text>
                    </View>
                </View>

                {agendado ? (
                    <TypedMaskedView
                        style={styles.titulo}
                        maskElement={
                            <View style={{ backgroundColor: 'transparent' }}>
                                <Text style={styles.nomeEvento}>
                                    {item.evento.nome}
                                </Text>
                            </View>
                        }
                    >
                        <LinearGradient
                            colors={[Colors.primary.start, Colors.primary.end]}
                        >
                            <Text
                                style={[
                                    styles.nomeEvento,
                                    { opacity: 0 },
                                ]}
                            >
                                {item.evento.nome}
                            </Text>
                        </LinearGradient>
                    </TypedMaskedView>
                ) : (
                    <Text style={styles.nomeEvento}>
                        {item.evento.nome}
                    </Text>
                )}

                <Text style={styles.dataEvento}>
                    {formatarData(item.evento.dataHora)}{' '}
                    {formatarHora(item.evento.dataHora)}
                </Text>

                <Text style={styles.endereco}>
                    {item.evento.endereco}
                </Text>

                {item.evento.status !== 'CONCLUIDO' && (
                    <View style={styles.badgeContainer}>
                        <View
                            style={[
                                styles.badge,
                                cancelada
                                    ? styles.badgeCancelado
                                    : styles.badgeRealizado,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.badgeTexto,
                                    cancelada
                                        ? styles.textoCancelado
                                        : styles.textoRealizado,
                                ]}
                            >
                                {cancelada
                                    ? 'Inscrição cancelada'
                                    : 'Inscrição realizada'}
                            </Text>
                        </View>
                    </View>
                )}

                {podeCancelar && (
                    <View style={styles.acoes}>
                        <Button
                            title="Cancelar inscrição"
                            variant="filled"
                            onPress={() =>
                                confirmarCancelamento(item.inscricaoId)
                            }
                        />
                    </View>
                )}
            </View>
        );

        return agendado ? (
            <LinearGradient
                colors={[Colors.primary.start, Colors.primary.end]}
                style={styles.cardBorder}
            >
                {conteudoCard}
            </LinearGradient>
        ) : (
            <View
                style={[
                    styles.cardBorder,
                    {
                        borderWidth: 1,
                        borderColor: statusEvento.corTexto,
                    },
                ]}
            >
                {conteudoCard}
            </View>
        );
    }


    const eventosFiltrados = eventos.filter((item) =>
        item.evento.nome
            .toLowerCase()
            .includes(pesquisaDebounced.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>
                Histórico de inscrições
            </Text>

            <View style={styles.filtros}>
                <Input
                    label="Pesquisar"
                    value={pesquisa}
                    onChangeText={setPesquisa}
                    returnKeyType="search"
                    autoCapitalize="none"
                />
            </View>

            {carregando && eventos.length === 0 ? (
                <ActivityIndicator
                    size="large"
                    color={Colors.primary.end}
                />
            ) : error ? (
                <Text style={styles.mensagem}>
                    {error}
                </Text>
            ) : (
                <FlatList
                    data={eventosFiltrados}
                    keyExtractor={(item) => String(item.inscricaoId)}
                    renderItem={renderInscricao}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    contentContainerStyle={styles.lista}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 16 }} />
                    )}
                    refreshing={refreshing}
                    onRefresh={atualizarHistorico}
                    ListEmptyComponent={
                        <Text style={styles.mensagem}>
                            {pesquisaDebounced
                                ? 'Nenhum evento encontrado.'
                                : 'Você ainda não possui inscrições.'}
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


    cardBorder: {
        width: '100%',
        borderRadius: 14,
        padding: 2,
    },

    card: {
        padding: 14,
        borderRadius: 12,
        gap: 8,
        backgroundColor: Colors.secondary,
    },

    cardApagado: {
        opacity: 0.5,
    },


    titulo: {
        width: '100%',
    },

    filtros: {
        gap: 8,
        marginBottom: 15,
    },

    lista: {
        paddingBottom: 20,
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

    badgeContainer: {
        flexShrink: 0,
        alignItems: 'flex-start',
    },

    badge: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },

    badgeCancelado: {
        backgroundColor: '#FCE4E4',
        borderColor: '#D32F2F',
    },

    badgeRealizado: {
        backgroundColor: '#E0F4E5',
        borderColor: '#23843D',
    },

    badgeTexto: {
        fontSize: 10,
        fontWeight: '600',
    },

    badgeEvento: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },

    textoCancelado: {
        color: '#D32F2F',
    },

    textoRealizado: {
        color: '#23843D',
    },

    acoes: {
        marginTop: 8,
    },

    mensagem: {
        textAlign: 'center',
        marginTop: 30,
        color: Colors.text.secondary,
    },
});
