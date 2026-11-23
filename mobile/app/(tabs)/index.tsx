
import { EventoCard } from '@/components/evento-card';
import { Input } from '@/components/generic-input';
import { Select } from '@/components/generic-select';
import { Colors } from '@/constants/Colors';
import { useEventos } from '@/hooks/useEventos';
import { buscarCategorias } from '@/services/categoriaService';
import { buscarSubcategoriasPorCategoria } from '@/services/subcategoriaService';
import { Categoria } from '@/types/Categoria';
import { Subcategoria } from '@/types/Subcategoria';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, Keyboard, View } from 'react-native';

export default function Index() {

  const { eventos, loading, error, carregarEventos } = useEventos();
  const [pesquisa, setPesquisa] = useState('');
  const [pesquisaDebounced, setPesquisaDebounced] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [subcategoriaId, setSubcategoriaId] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [categoriasLoading, setCategoriasLoading] = useState(true);
  const [subcategoriasLoading, setSubcategoriasLoading] = useState(false);
  const [categoriasError, setCategoriasError] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    const carregarCategorias = async () => {
      try {
        setCategoriasLoading(true);
        setCategoriasError(null);
        const dados = await buscarCategorias();
        if (ativo) setCategorias(dados);
      } catch (err) {
        console.error(err);
        if (ativo) setCategoriasError('Não foi possível carregar as categorias.');
      } finally {
        if (ativo) setCategoriasLoading(false);
      }
    };

    carregarCategorias();
    return () => { ativo = false; };
  }, []);

  useEffect(() => {
    let ativo = true;

    if (categoriaId === null) {
      setSubcategorias([]);
      setSubcategoriasLoading(false);
      return () => { ativo = false; };
    }

    const carregarSubcategorias = async () => {
      try {
        setSubcategoriasLoading(true);
        const dados = await buscarSubcategoriasPorCategoria(categoriaId);
        if (ativo) setSubcategorias(dados);
      } catch (err) {
        console.error(err);
        if (ativo) setSubcategorias([]);
      } finally {
        if (ativo) setSubcategoriasLoading(false);
      }
    };

    carregarSubcategorias();
    return () => { ativo = false; };
  }, [categoriaId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPesquisaDebounced(pesquisa.trim());
    }, 500);

    return () => clearTimeout(timeout);
  }, [pesquisa]);

  useEffect(() => {
    carregarEventos({
      nome: pesquisaDebounced || undefined,
      categoriaId: categoriaId ?? undefined,
      subcategoriaId: subcategoriaId ?? undefined,
    });
  }, [pesquisaDebounced, categoriaId, subcategoriaId, carregarEventos]);

  const subcategoriasFiltradas = subcategorias
    .filter((item) => item.categoriaId === categoriaId)
    .map((item) => ({
      label: item.nome,
      value: item.id,
    }));

  const selecionarCategoria = (id: number | null) => {
    setCategoriaId(id);
    setSubcategoriaId(null);
  };

  const selecionarSubcategoria = (id: number | null) => {
    setSubcategoriaId(id);

    if (id === null) return;

    const subcategoria = subcategorias.find(
      (item) => item.id === id
    );

    if (subcategoria) {
      setCategoriaId(subcategoria.categoriaId);
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.titulo}>
          Descubra novos eventos
        </Text>

        <View style={styles.filtros}>
          <Input
            label="Pesquisar"
            value={pesquisa}
            onChangeText={setPesquisa}
            returnKeyType="search"
            autoCapitalize="none"
          />

          <View style={styles.filtroSelect}>

            <View style={styles.selectItem}>
              <Select
                label="Categoria"
                value={categoriaId}
                options={categorias.map((item) => ({
                  label: item.nome,
                  value: item.id,
                }))}
                onChange={selecionarCategoria}
                disabled={categoriasLoading}
              />
            </View>

            {categoriaId !== null && (
              <View style={styles.selectItem}>
                <Select
                  label="Subcategoria"
                  value={subcategoriaId}
                  options={subcategoriasFiltradas}
                  onChange={selecionarSubcategoria}
                  disabled={!categoriaId || subcategoriasLoading}
                />
                {categoriasError && <Text>{categoriasError}</Text>}
              </View>
            )}
          </View>
        </View>

        {loading && eventos.length === 0 ? (
          <ActivityIndicator size="large" color={Colors.primary.end} />
        ) : error ? (
          <Text>{error}</Text>
        ) : (
          <FlatList
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            data={eventos}
            keyExtractor={(item) => String(item.id)}
            numColumns={1}
            contentContainerStyle={styles.lista}
            ItemSeparatorComponent={() => (
              <View style={{ height: 20 }} />
            )}
            renderItem={({ item }) => (
              <EventoCard
                {...item}
                onPress={() => console.log('Evento:', item.id)}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.mensagem}>
                Nenhum evento encontrado.
              </Text>
            }
            refreshing={loading}
            onRefresh={() =>
              carregarEventos({
                nome: pesquisaDebounced || undefined,
                categoriaId: categoriaId ?? undefined,
                subcategoriaId: subcategoriaId ?? undefined,
              })
            }
          />
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F1',
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

  filtroSelect: {
    flexDirection: 'row',
    gap: 16,
  },

  selectItem: {
    flex: 1,
    minWidth: 0,
  },

  lista: {
    paddingBottom: 20,
  },

  mensagem: {
    textAlign: 'center',
    marginTop: 30,
  },
});
