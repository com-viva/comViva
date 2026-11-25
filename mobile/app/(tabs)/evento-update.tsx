import { useEventos } from '@/hooks/useEventos';
import { Input } from '@/components/generic-input';
import { Select } from '@/components/generic-select';
import { Button } from '@/components/generic-button';
import { Colors } from '@/constants/Colors';
import { buscarCategorias } from '@/services/categoriaService';
import { buscarSubcategoriasPorCategoria } from '@/services/subcategoriaService';
import { Categoria } from '@/types/Categoria';
import { Subcategoria } from '@/types/Subcategoria';
import { EventoRequest } from '@/types/EventoRequest';
import { NivelEvento } from '@/types/NivelEvento';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Alert, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DescricaoRequest } from '@/types/DescricaoRequest';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function EventoUpdateScreen() {

    const { id } = useLocalSearchParams<{ id?: string }>();

    const isEdicao = !!id;

    const { criar, atualizar, buscarPorId, gerarDesc } = useEventos();

    const [loading, setLoading] = useState(false);

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(null);
    const [categoriaId, setCategoriaId] = useState<number | null>(null);
    const [subcategoriaId, setSubcategoriaId] = useState<number | null>(null);
    const [endereco, setEndereco] = useState('');
    const [data, setData] = useState<Date | null>(null);
    const [hora, setHora] = useState<Date | null>(null);
    const [mostrarCalendario, setMostrarCalendario] = useState(false);
    const [mostrarRelogio, setMostrarRelogio] = useState(false);
    const [capacidadeMin, setCapacidadeMin] = useState('');
    const [capacidadeMax, setCapacidadeMax] = useState('');
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);

    const niveis = [
        { label: 'Iniciante', value: 1 },
        { label: 'Intermediário', value: 2 },
        { label: 'Avançado', value: 3 },
    ];

    const categoriasOptions = categorias.map((categoria) => ({
        label: categoria.nome,
        value: categoria.id,
    }));

    const subcategoriasOptions = subcategorias.map((subcategoria) => ({
        label: subcategoria.nome,
        value: subcategoria.id,
    }));

    const converterNivel = (nivel: NivelEvento): number => {
        switch (nivel) {
            case 'INICIANTE':
                return 1;
            case 'INTERMEDIARIO':
                return 2;
            case 'AVANCADO':
                return 3;
        }
    };

    const nivelParaEnviar = (): NivelEvento => {
        switch (nivelSelecionado) {
            case 1:
                return 'INICIANTE';
            case 2:
                return 'INTERMEDIARIO';
            default:
                return 'AVANCADO';
        }
    };

    const formatarData = (valor: Date | null) => {
        return valor ? valor.toLocaleDateString('pt-BR') : '';
    };

    const formatarHora = (valor: Date | null) => {
        return valor
            ? valor.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            })
            : '';
    };

    const formatarDataHoraParaEnviar = () => {
        if (!data || !hora) return '';

        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');

        const horas = String(hora.getHours()).padStart(2, '0');
        const minutos = String(hora.getMinutes()).padStart(2, '0');

        return `${ano}-${mes}-${dia}T${horas}:${minutos}:00`;
    };

    useEffect(() => {
        const carregarCategorias = async () => {
            try {
                const response = await buscarCategorias();
                setCategorias(response);
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
                Alert.alert('Erro', 'Não foi possível carregar as categorias.');
            }
        };

        carregarCategorias();
    }, []);

    useEffect(() => {
        const carregarSubcategorias = async () => {
            if (categoriaId === null) {
                setSubcategorias([]);
                return;
            }

            try {
                const response = await buscarSubcategoriasPorCategoria(categoriaId);
                setSubcategorias(response);
            } catch (error) {
                console.error('Erro ao carregar subcategorias:', error);
                setSubcategorias([]);
                Alert.alert('Erro', 'Não foi possível carregar as subcategorias.');
            }
        };

        carregarSubcategorias();
    }, [categoriaId]);

    useEffect(() => {
        if (!id) return;

        const carregarEvento = async () => {
            try {
                setLoading(true);

                const response = await buscarPorId(Number(id));

                const dataEvento = new Date(response.dataHora);
                setData(dataEvento);
                setHora(dataEvento);

                setNome(response.nome);
                setDescricao(response.descricao);
                setNivelSelecionado(converterNivel(response.nivel));
                setCategoriaId(response.categoriaId);
                setSubcategoriaId(response.subcategoriaId);
                setEndereco(response.endereco);
                setCapacidadeMin(String(response.capacidadeMin));
                setCapacidadeMax(String(response.capacidadeMax));

            } catch (error) {
                console.error('Erro ao carregar evento:', error);
                Alert.alert('Erro', 'Não foi possível carregar o evento.');
            } finally {
                setLoading(false);
            }
        };

        carregarEvento();
    }, [id]);

    const selecionarCategoria = (value: number | null) => {
        setCategoriaId(value);
        setSubcategoriaId(null);
    };

    const gerarDescricao = async () => {
        if (
            !nome.trim() ||
            nivelSelecionado === null ||
            categoriaId === null ||
            !data ||
            !hora ||
            !endereco.trim()
        ) {
            return;
        }

        const dadosPython: DescricaoRequest = {
            nomeEvento: nome,
            nivelEvento: nivelParaEnviar(),
            categoriaId,
            subcategoriaId,
            dataHora: formatarDataHoraParaEnviar(),
            endereco,
        };

        try {
            setLoading(true);

            const response = await gerarDesc(dadosPython);

            setDescricao(response.descricao);

        } catch (error) {
            console.error('Erro ao gerar descrição:', error);
            Alert.alert('Erro', 'Não foi possível gerar a descrição do evento.');
        } finally {
            setLoading(false);
        }
    };

    const salvarEvento = async () => {

        const min = Number(capacidadeMin);
        const max = Number(capacidadeMax);

        if (!nome.trim() || !descricao.trim() || !endereco.trim()) {
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
            return;
        }

        if (nivelSelecionado === null) {
            Alert.alert('Atenção', 'Selecione o nível do evento.');
            return;
        }

        if (categoriaId === null) {
            Alert.alert('Atenção', 'Selecione uma categoria.');
            return;
        }

        if (
            capacidadeMin.trim() === '' ||
            capacidadeMax.trim() === '' ||
            !Number.isFinite(min) ||
            !Number.isFinite(max) ||
            min <= 0 ||
            max < min
        ) {
            Alert.alert('Atenção', 'Verifique as capacidades informadas.');
            return;
        }

        if (!data || !hora) {
            Alert.alert('Atenção', 'Selecione a data e o horário do evento.');
            return;
        }

        const dados: EventoRequest = {
            nome,
            descricao,
            dataHora: formatarDataHoraParaEnviar(),
            capacidadeMin: min,
            capacidadeMax: max,
            endereco,
            nivel: nivelParaEnviar(),
            categoriaId,
            subcategoriaId,
        };

        try {
            setLoading(true);

            if (isEdicao) {
                await atualizar(Number(id), dados);

                Alert.alert(
                    'Sucesso',
                    'Evento atualizado com sucesso!',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
            } else {
                await criar(dados);

                Alert.alert(
                    'Sucesso',
                    'Evento criado com sucesso!',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
            }

        } catch (error) {
            console.error('Erro ao salvar evento:', error);
            Alert.alert('Erro', 'Não foi possível salvar o evento.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (isEdicao) return;

            setNome('');
            setDescricao('');
            setNivelSelecionado(null);
            setCategoriaId(null);
            setSubcategoriaId(null);
            setEndereco('');
            setData(null);
            setHora(null);
            setMostrarCalendario(false);
            setMostrarRelogio(false);
            setCapacidadeMin('');
            setCapacidadeMax('');
            setLoading(false);

        }, [isEdicao])
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.titulo}>
                {isEdicao ? 'Edite seu evento' : 'Crie um evento'}
            </Text>

            <View style={styles.form}>

                <Input
                    label="Nome do evento"
                    value={nome}
                    onChangeText={setNome}
                    maxLength={255}
                />

                <Input
                    label="Endereço"
                    value={endereco}
                    onChangeText={setEndereco}
                    maxLength={255}
                />

                <View style={styles.horizontalContainer}>
                    <View style={styles.item}>
                        <Input
                            label="Data do evento"
                            value={formatarData(data)}
                            editable={false}
                            onPress={() => setMostrarCalendario(true)}
                        />

                        {mostrarCalendario && (
                            <DateTimePicker
                                value={data ?? new Date()}
                                mode="date"
                                display="default"
                                locale="pt-BR"
                                minimumDate={new Date()}
                                onValueChange={(_, selectedDate) => {
                                    setMostrarCalendario(false);
                                    setData(selectedDate);
                                }}
                                onDismiss={() => setMostrarCalendario(false)}
                            />
                        )}
                    </View>

                    <View style={styles.item}>
                        <Input
                            label="Horário do evento"
                            value={formatarHora(hora)}
                            editable={false}
                            onPress={() => setMostrarRelogio(true)}
                        />

                        {mostrarRelogio && (
                            <DateTimePicker
                                value={hora ?? new Date()}
                                mode="time"
                                display="default"
                                locale="pt-BR"
                                is24Hour
                                onValueChange={(_, selectedTime) => {
                                    setMostrarRelogio(false);
                                    setHora(selectedTime);
                                }}
                                onDismiss={() => setMostrarRelogio(false)}
                            />
                        )}
                    </View>
                </View>

                <Select
                    label="Nível do evento"
                    options={niveis}
                    value={nivelSelecionado}
                    onChange={setNivelSelecionado}
                />

                <View style={styles.horizontalContainer}>
                    <View style={styles.item}>
                        <Select
                            label="Categoria"
                            options={categoriasOptions}
                            value={categoriaId}
                            onChange={selecionarCategoria}
                        />
                    </View>
                    {categoriaId !== null && (
                        <View style={styles.item}>
                            <Select
                                label="Subcategoria"
                                options={subcategoriasOptions}
                                value={subcategoriaId}
                                onChange={setSubcategoriaId}
                                disabled={categoriaId === null}
                            />
                        </View>
                    )}
                </View>

                <View style={styles.descricaoContainer}>
                    <View style={styles.descricaoCampo}>
                        <Input
                            label="Descrição"
                            value={descricao}
                            onChangeText={setDescricao}
                            multiline
                            maxLength={500}
                        />
                    </View>

                    {nome.trim() && nivelSelecionado !== null && categoriaId !== null && data && hora && endereco.trim() !== '' && (
                        <View style={styles.descricaoBotao}>
                            <Pressable
                                onPress={gerarDescricao}
                                disabled={loading}
                            >
                                <AntDesign
                                    name="bulb"
                                    size={20}
                                    color={loading ? Colors.text.secondary : Colors.primary.start}
                                />
                            </Pressable>
                        </View>
                    )}
                </View>

                <View style={styles.horizontalContainer}>
                    <View style={styles.item}>

                        <Input
                            label="Capacidade mínima"
                            value={capacidadeMin}
                            onChangeText={setCapacidadeMin}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.item}>

                        <Input
                            label="Capacidade máxima"
                            value={capacidadeMax}
                            onChangeText={setCapacidadeMax}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title={isEdicao ? 'Salvar alterações' : 'Criar evento'}
                        onPress={salvarEvento}
                        loading={loading}
                        disabled={loading}
                    />
                </View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
        paddingTop: 12,
    },

    content: {
        paddingBottom: 20,
    },

    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.text.primary,
        textTransform: 'uppercase',
    },

    form: {
        gap: 20,
    },

    buttonContainer: {
        marginTop: 16,
    },

    horizontalContainer: {
        flexDirection: 'row',
        gap: 16,
        width: '100%',
    },

    item: {
        flex: 1,
        minWidth: 0,
    },

    descricaoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
    },

    descricaoCampo: {
        flex: 1,
    },

    descricaoBotao: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 4,
    },
});