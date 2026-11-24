
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

import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';

import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Alert,
} from 'react-native';

export default function EventoUpdateScreen() {

    const { id } = useLocalSearchParams<{ id?: string }>();

    const isEdicao = !!id;

    const {
        criar,
        atualizar,
        buscarPorId,
    } = useEventos();

    const [loading, setLoading] = useState(false);

    // Dados do formulário
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(null);

    const [categoriaId, setCategoriaId] = useState<number | null>(null);
    const [subcategoriaId, setSubcategoriaId] = useState<number | null>(null);

    const [endereco, setEndereco] = useState('');
    const [dataHora, setDataHora] = useState('');

    const [capacidadeMin, setCapacidadeMin] = useState('');
    const [capacidadeMax, setCapacidadeMax] = useState('');

    // Categorias e subcategorias
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);

    // Opções do nível
    const niveis = [
        { label: 'Iniciante', value: 1 },
        { label: 'Intermediário', value: 2 },
        { label: 'Avançado', value: 3 },
    ];

    // Opções dos selects
    const categoriasOptions = categorias.map((categoria) => ({
        label: categoria.nome,
        value: categoria.id,
    }));

    const subcategoriasOptions = subcategorias.map((subcategoria) => ({
        label: subcategoria.nome,
        value: subcategoria.id,
    }));

    // Converter nível recebido da API
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

    // Converter nível para enviar à API
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

    // Buscar categorias
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

    // Buscar subcategorias quando a categoria mudar
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

    // Buscar evento para edição
    useEffect(() => {
        if (!id) return;

        const carregarEvento = async () => {
            try {
                setLoading(true);

                const response = await buscarPorId(Number(id));

                setNome(response.nome);
                setDescricao(response.descricao);
                setNivelSelecionado(converterNivel(response.nivel));

                setCategoriaId(response.categoriaId);
                setSubcategoriaId(response.subcategoriaId);

                setEndereco(response.endereco);
                setDataHora(response.dataHora);

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

    // Selecionar categoria
    const selecionarCategoria = (value: number | null) => {
        setCategoriaId(value);
        setSubcategoriaId(null);
    };

    // Salvar evento
    const salvarEvento = async () => {

        const min = Number(capacidadeMin);
        const max = Number(capacidadeMax);

        if (
            !nome.trim() ||
            !descricao.trim() ||
            !endereco.trim() ||
            !dataHora.trim()
        ) {
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

        const dados: EventoRequest = {
            nome,
            descricao,
            dataHora,
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

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>
                {isEdicao ? 'Editar evento' : 'Criar evento'}
            </Text>

            <View style={styles.form}>

                <Input
                    label="Nome do evento"
                    value={nome}
                    onChangeText={setNome}
                />

                <Input
                    label="Descrição"
                    value={descricao}
                    onChangeText={setDescricao}
                    multiline
                    numberOfLines={3}
                />

                <Select
                    label="Nível do evento"
                    options={niveis}
                    value={nivelSelecionado}
                    onChange={setNivelSelecionado}
                />

                <Select
                    label="Categoria"
                    options={categoriasOptions}
                    value={categoriaId}
                    onChange={selecionarCategoria}
                />

                <Select
                    label="Subcategoria"
                    options={subcategoriasOptions}
                    value={subcategoriaId}
                    onChange={setSubcategoriaId}
                    disabled={categoriaId === null}
                />

                <Input
                    label="Endereço"
                    value={endereco}
                    onChangeText={setEndereco}
                />

                <Input
                    label="Data e hora"
                    value={dataHora}
                    onChangeText={setDataHora}
                />

                <Input
                    label="Capacidade mínima"
                    value={capacidadeMin}
                    onChangeText={setCapacidadeMin}
                    keyboardType="numeric"
                />

                <Input
                    label="Capacidade máxima"
                    value={capacidadeMax}
                    onChangeText={setCapacidadeMax}
                    keyboardType="numeric"
                />

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
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: 28,
    },
    form: {
        gap: 20,
    },
    buttonContainer: {
        marginTop: 16,
    },
});
