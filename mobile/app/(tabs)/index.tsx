
import { EventoCard } from '@/components/evento-card';
import { useEventos } from '@/hooks/useEventos';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function Index() {
  const { eventos, loading, error, carregarEventos } = useEventos();

  useEffect(() => {
    carregarEventos();
  }, [carregarEventos]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Descubra novos eventos
      </Text>

      {loading && eventos.length === 0 ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.linha}
          contentContainerStyle={styles.lista}
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
          onRefresh={carregarEventos}
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
    paddingTop: 24,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#171717',
    textTransform: 'uppercase',
  },
  lista: {
    paddingBottom: 20,
  },
  linha: {
    gap: 16,
    marginBottom: 16,
  },
  mensagem: {
    textAlign: 'center',
    marginTop: 30,
  },
});
