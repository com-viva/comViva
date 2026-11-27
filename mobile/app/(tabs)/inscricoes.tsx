
import { EventoCard } from '@/components/evento-card';
import { Input } from '@/components/generic-input';
import { Colors } from '@/constants/Colors';
import { useInscricoes } from '@/hooks/useInscricoes';
import { buscarEventoPorId } from '@/services/eventoService';
import { Evento } from '@/types/Evento';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

interface EventoInscrito {
    evento: Evento;
    inscricaoId: number;
}

export default function InscricoesScreen() {
    const {
        error,
        buscarPorUsuario,
        cancelar
    } = useInscricoes();

    const [eventos, setEventos] = useState<EventoInscrito[]>([]);
    const [pesquisa, setPesquisa] = useState('');
    const [pesquisaDebounced, setPesquisaDebounced] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [carregandoEventos, setCarregandoEventos] = useState(false);

    const carregarInscricoes = useCallback(async () => {
        try {
            setCarregandoEventos(true);

            const dados = await buscarPorUsuario();

            const inscricoesAtivas = dados.filter(
                (item) => item.status === 'REALIZADA'
            );

            const eventosInscritos = await Promise.all(
                inscricoesAtivas.map(async (item) => {
                    const evento = await buscarEventoPorId(item.eventoId);

                    return {
                        evento,
                        inscricaoId: item.id
                    };
                })
            );

            setEventos(
                eventosInscritos.filter(
                    (item) => item.evento.status === 'AGENDADO'
                )
            );
        } catch (err) {
            console.error('Erro ao carregar inscrições:', err);
        } finally {
            setCarregandoEventos(false);
        }
    }, [buscarPorUsuario]);

    useEffect(() => {
        carregarInscricoes();
    }, [carregarInscricoes]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPesquisaDebounced(pesquisa.trim());
        }, 500);

        return () => clearTimeout(timeout);
    }, [pesquisa]);

    const atualizarInscricoes = async () => {
        try {
            setRefreshing(true);
            await carregarInscricoes();
        } finally {
            setRefreshing(false);
        }
    };


    const handleCancelarInscricao = async (inscricaoId: number) => {
        try {
            await cancelar(inscricaoId);

            await carregarInscricoes();
        } catch (err) {
            console.error('Erro ao cancelar inscrição:', err);
        }
    };

    const eventosFiltrados = eventos.filter((item) =>
        item.evento.nome.toLowerCase().includes(pesquisaDebounced.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>
                Suas inscrições
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

            {carregandoEventos && eventos.length === 0 ? (
                <ActivityIndicator
                    size="large"
                    color={Colors.primary.end}
                />
            ) : error ? (
                <Text>{error}</Text>
            ) : (
                <FlatList
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    data={eventosFiltrados}
                    keyExtractor={(item) => String(item.evento.id)}
                    numColumns={1}
                    contentContainerStyle={styles.lista}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 20 }} />
                    )}
                    renderItem={({ item }) => (
                        <EventoCard
                            {...item.evento}
                            onPress={() => console.log('Evento:', item.evento.id)}
                            mostrarCancelarInscricao={true}
                            onCancelarInscricao={() =>
                                handleCancelarInscricao(item.inscricaoId)
                            }
                        />
                    )}
                    ListEmptyComponent={
                        <Text style={styles.mensagem}>
                            {pesquisaDebounced
                                ? 'Nenhum evento encontrado.'
                                : 'Você ainda não possui inscrições.'}
                        </Text>
                    }
                    refreshing={refreshing}
                    onRefresh={atualizarInscricoes}
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
        marginBottom: 10,
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

    mensagem: {
        textAlign: 'center',
        marginTop: 30,
    },
});
