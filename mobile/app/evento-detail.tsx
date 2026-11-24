import { Button } from '@/components/generic-button';
import { Colors } from '@/constants/Colors';
import { useEventos } from '@/hooks/useEventos';
import { useInscricoes } from '@/hooks/useInscricoes';
import { Entypo } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { MaskedViewProps } from '@react-native-masked-view/masked-view';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import type { ComponentType } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function EventoDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { evento, loading, buscarPorId } = useEventos();
    const { criarInscricao, buscarPorUsuario, cancelar, loading: processando } = useInscricoes();
    const [refreshing, setRefreshing] = useState(false);
    const [inscricaoId, setInscricaoId] = useState<number | null>(null);
    const [verificandoInscricao, setVerificandoInscricao] = useState(true);

    const carregarEvento = useCallback(async () => {
        if (!id) return;

        await buscarPorId(Number(id));
    }, [id, buscarPorId]);

    useEffect(() => {
        carregarEvento();
    }, [carregarEvento]);

    const atualizarEvento = async () => {
        try {
            setRefreshing(true);
            await carregarEvento();
        } finally {
            setRefreshing(false);
        }
    };

    const verificarInscricao = useCallback(async () => {
        if (!evento) return;

        try {
            setVerificandoInscricao(true);

            const dados = await buscarPorUsuario();

            const inscricaoAtiva = dados.find(
                (item) =>
                    item.eventoId === evento.id &&
                    item.status === 'REALIZADA'
            );

            setInscricaoId(inscricaoAtiva?.id ?? null);

        } catch (erro) {
            console.error('Erro ao verificar inscrição:', erro);
        } finally {
            setVerificandoInscricao(false);
        }
    }, [evento?.id, buscarPorUsuario]);

    useEffect(() => {
        if (evento) {
            verificarInscricao();
        }
    }, [evento?.id, verificarInscricao]);

    useEffect(() => {
        const intervalo = setInterval(() => {
            carregarEvento();
        }, 10000);

        return () => clearInterval(intervalo);
    }, [carregarEvento]);

    const handleInscricao = async () => {
        if (!evento) return;

        try {
            if (inscricaoId !== null) {
                await cancelar(inscricaoId);

                setInscricaoId(null);

                Alert.alert('Sucesso', 'Inscrição cancelada!');
            } else {
                await criarInscricao(evento.id);

                await verificarInscricao();

                Alert.alert('Sucesso', 'Inscrição realizada!');
            }

            await carregarEvento();

        } catch (erro) {
            Alert.alert('Erro', 'Não foi possível processar sua inscrição.');
        }
    };

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

    const formatarTexto = (nivel: string) => {
        return nivel.charAt(0).toUpperCase() + nivel.slice(1).toLowerCase();
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#7654C5" />
                <Text style={styles.loadingText}>Carregando evento...</Text>
            </View>
        );
    }

    if (!evento) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>
                    Não foi possível carregar os detalhes do evento.
                </Text>
            </View>
        );
    }

    const TypedMaskedView = MaskedView as ComponentType<MaskedViewProps>;

    return (
        <View style={styles.container}>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={atualizarEvento}
                        colors={[Colors.primary.start]}
                        tintColor={Colors.primary.start}
                    />
                }
            >
                <TypedMaskedView
                    style={styles.title}
                    maskElement={
                        <View style={{ backgroundColor: 'transparent' }}>
                            <Text style={styles.titleText}>
                                {evento.nome}
                            </Text>
                        </View>
                    }
                >
                    <LinearGradient
                        colors={[Colors.primary.start, Colors.primary.end]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={[styles.titleText, { opacity: 0 }]}>
                            {evento.nome}
                        </Text>
                    </LinearGradient>
                </TypedMaskedView>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sobre o evento</Text>

                    <LinearGradient
                        colors={[Colors.primary.start, Colors.primary.end]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.divider}
                    />

                    <Text style={styles.description}>
                        {evento.descricao}
                    </Text>
                </View>


                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informações</Text>

                    <LinearGradient
                        colors={[Colors.primary.start, Colors.primary.end]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.divider}
                    />

                    <View style={styles.infoItem}>
                        <View style={styles.infoHeader}>
                            <Entypo name="location-pin" size={20} color={Colors.primary.start} />
                            <Text style={styles.infoLabel}>Local</Text>
                        </View>

                        <Text style={styles.infoValue}>
                            {evento.endereco}
                        </Text>
                    </View>

                    <View style={styles.infoItem}>
                        <View style={styles.infoHeader}>
                            <FontAwesome name="calendar" size={18} color={Colors.primary.start} />
                            <Text style={styles.infoLabel}>Data</Text>
                        </View>

                        <Text style={styles.infoValue}>
                            {formatarData(evento.dataHora)}
                        </Text>
                    </View>

                    <View style={styles.infoItem}>
                        <View style={styles.infoHeader}>
                            <AntDesign name="clock-circle" size={18} color={Colors.primary.start} />
                            <Text style={styles.infoLabel}>Horário</Text>
                        </View>

                        <Text style={styles.infoValue}>
                            {formatarHora(evento.dataHora)}
                        </Text>
                    </View>

                    <View style={styles.infoItem}>
                        <View style={styles.infoHeader}>
                            <Ionicons name="star-outline" size={18} color={Colors.primary.start} />
                            <Text style={styles.infoLabel}>Nível</Text>
                        </View>

                        <Text style={styles.infoValue}>
                            {formatarTexto(evento.nivel)}
                        </Text>
                    </View>

                    <View style={styles.infoItem}>
                        <View style={styles.infoHeader}>
                            <Ionicons name="pricetag-outline" size={18} color={Colors.primary.start} />
                            <Text style={styles.infoLabel}>Categoria</Text>
                        </View>

                        <Text style={styles.infoValue}>
                            {evento.categoria}
                        </Text>
                    </View>

                    {evento.subcategoria !== null && (
                        <View style={styles.infoItem}>
                            <View style={styles.infoHeader}>
                                <Ionicons name="pricetags-outline" size={18} color={Colors.primary.start} />
                                <Text style={styles.infoLabel}>Subcategoria</Text>
                            </View>

                            <Text style={styles.infoValue}>
                                {evento.subcategoria}
                            </Text>
                        </View>
                    )}

                    <View style={styles.infoItem}>
                        <View style={styles.infoHeader}>
                            <Ionicons name="person-outline" size={18} color={Colors.primary.start} />
                            <Text style={styles.infoLabel}>Inscritos</Text>
                        </View>

                        <Text style={styles.infoValue}>
                            {evento.qntdInscritos}/{evento.capacidadeMax}
                        </Text>
                    </View>

                </View>

                {!verificandoInscricao && (
                    <Button
                        title={
                            processando
                                ? 'Aguarde...'
                                : inscricaoId !== null
                                    ? 'Cancelar inscrição'
                                    : 'Quero me inscrever'
                        }
                        onPress={handleInscricao}
                        variant={inscricaoId !== null ? 'outline' : 'filled'}
                        disabled={processando}
                    />
                )}

            </ScrollView>
        </View>
    );

}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    content: {
        padding: 24,
        paddingBottom: 40,
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        padding: 24,
    },

    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
    },
    title: {
        width: '100%',
        marginBottom: 32,
    },

    titleText: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'left',
    },

    section: {
        marginBottom: 32,
    },

    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 12,
    },

    divider: {
        height: 3,
        width: '100%',
        borderRadius: 10,
        marginBottom: 20,
    },

    description: {
        fontSize: 18,
        lineHeight: 29,
        color: Colors.text.secondary,
    },


    infoItem: {
        marginBottom: 22,
        gap: 8,
    },

    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    infoLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#77717F',
    },

    infoValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#30264A',
        lineHeight: 26,
        marginLeft: 28,
    },

});

function criarInscricao(arg0: number) {
    throw new Error('Function not implemented.');
}

