
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Entypo }  from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';

interface EventoCardProps {
  nome: string;
  endereco: string;
  dataHora: string;
  descricao: string;
  onPress: () => void;
}

export function EventoCard({
  nome,
  endereco,
  dataHora,
  descricao,
  onPress,
}: EventoCardProps) {
    
  const data = new Date(dataHora);

  const dataFormatada = data.toLocaleDateString('pt-BR');
  const horaFormatada = data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.card}>
      <Text style={styles.nome} numberOfLines={2}>
        {nome}
      </Text>

      <Text style={styles.info} numberOfLines={2}>
        <Entypo name="location-pin" size={18} color="black" /> {endereco}
      </Text>

      <Text style={styles.info}>
        <FontAwesome name="calendar" size={18} color="black" /> {dataFormatada}
      </Text>

      <Text style={styles.info}>
        <AntDesign name="clock-circle" size={18} color="black" /> {horaFormatada}
      </Text>

      <Text style={styles.descricao} numberOfLines={3}>
        {descricao}
      </Text>

      <Pressable style={styles.botao} onPress={onPress}>
        <Text style={styles.botaoTexto}>Saber mais</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#A34CF5',
    borderRadius: 16,
    padding: 10,
    gap: 7,
  },
  nome: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#171717',
  },
  info: {
    fontSize: 11,
    color: '#333333',
  },
  descricao: {
    fontSize: 11,
    color: '#333333',
    lineHeight: 15,
  },
  botao: {
    backgroundColor: '#9747E8',
    borderRadius: 20,
    paddingVertical: 6,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
