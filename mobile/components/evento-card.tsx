
import { Button } from '@/components/generic-button';
import { Colors } from '@/constants/Colors';
import { Entypo } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaskedView from '@react-native-masked-view/masked-view';
import type { ComponentType } from 'react';
import type { MaskedViewProps } from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

interface EventoCardProps {
  id: number;
  nome: string;
  endereco: string;
  dataHora: string;
  descricao: string;
  nivel: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
  categoria: string;
  subcategoria: string | null;
  onPress: () => void;
}

export function EventoCard({
  id,
  nome,
  endereco,
  dataHora,
  descricao,
  nivel,
  categoria,
  subcategoria,
  onPress,
}: EventoCardProps) {

  const router = useRouter();

  const data = new Date(dataHora);

  const dataFormatada = data.toLocaleDateString('pt-BR');
  const horaFormatada = data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const TypedMaskedView = MaskedView as ComponentType<MaskedViewProps>;


  const nivelConfig = {
    INICIANTE: {
      texto: 'Iniciante',
      cor: '#E5F5E9',
      corTexto: '#278044',
    },
    INTERMEDIARIO: {
      texto: 'Intermediário',
      cor: '#FFF3D6',
      corTexto: '#A87512',
    },
    AVANCADO: {
      texto: 'Avançado',
      cor: '#F2E8FF',
      corTexto: '#8045B5',
    },
  };

  const handleEventoPress = (eventoId: number) => {
    router.push({
      pathname: '/evento-detail',
      params: { id: eventoId.toString() },
    });
  };

  return (
    <LinearGradient
      colors={[Colors.primary.start, Colors.primary.end]}
      style={styles.cardBorder}
    >
      <View style={styles.card}>
        <View style={styles.content}>

          <View style={styles.titleContainer}>
            <TypedMaskedView
              style={styles.title}
              maskElement={
                <View style={{ backgroundColor: 'transparent' }}>
                  <Text style={styles.nome} numberOfLines={2}>
                    {nome}
                  </Text>
                </View>
              }
            >
              <LinearGradient colors={[Colors.primary.start, Colors.primary.end]}>
                <Text style={[styles.nome, { opacity: 0 }]} numberOfLines={2}>
                  {nome}
                </Text>
              </LinearGradient>
            </TypedMaskedView>

            <View style={styles.badgeContainer}>
              <View style={[styles.badge, { backgroundColor: nivelConfig[nivel].cor, borderColor: nivelConfig[nivel].corTexto }]}>
                <View style={styles.infoContainer}>
                  <AntDesign name="star" size={12} color={nivelConfig[nivel].corTexto} />
                  <Text style={[styles.badgeTexto, { color: nivelConfig[nivel].corTexto }]}>
                    {nivelConfig[nivel].texto}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.descricao} numberOfLines={3}>
            {descricao}
          </Text>

          <View style={styles.infos}>
            <View style={styles.infoContainer}>
              <FontAwesome name="calendar" size={18} color="black" />
              <Text style={styles.info}>{dataFormatada}</Text>
            </View>

            <View style={styles.infoContainer}>
              <AntDesign name="clock-circle" size={18} color="black" />
              <Text style={styles.info}>{horaFormatada}</Text>
            </View>
          </View>

          <View style={[styles.infoContainer, { flex: 1 }]}>
            <Entypo name="location-pin" size={18} color="black" />
            <Text
              style={styles.info}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {endereco}
            </Text>
          </View>

          <View style={[styles.infos, { marginTop: 10 }]}>
            <View style={[styles.badge, styles.categoria]}>
              <Text style={[styles.badgeTexto, styles.categoriaTexto]}>{categoria}</Text>
            </View>

            {subcategoria != null &&
              <View style={[styles.badge, styles.subcategoria]}>
                <Text style={[styles.badgeTexto, styles.subcategoriaTexto]}>{subcategoria}</Text>
              </View>
            }
          </View>
        </View>

        <Button
          title="Saber mais"
          onPress={() => handleEventoPress(id)}
          variant="filled"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cardBorder: {
    width: '100%',
    borderRadius: 16,
    padding: 2,
  },

  card: {
    flex: 1,
    backgroundColor: '#ffecf9',
    borderRadius: 14,
    padding: 10,
    gap: 7,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 10,
  },

  title: {
    flex: 1,
    minWidth: 0,
  },

  content: {
    marginBottom: 15,
    gap: 8,
  },

  nome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'left',
  },

  infos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  info: {
    fontSize: 11,
    color: '#333333',
    flexShrink: 1,
  },

  descricao: {
    fontSize: 13,
    color: '#333333',
    lineHeight: 15,
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

  categoria: {
    backgroundColor: '#f3e8ff',
    color: '#6b21a8',
    borderColor: '#6b21a8',
  },

  categoriaTexto: {
    color: '#6b21a8',
  },

  subcategoria: {
    backgroundColor: '#ffedd5',
    color: '#c2410c',
    borderColor: '#c2410c',
  },

  subcategoriaTexto: {
    color: '#c2410c',
  },

});
