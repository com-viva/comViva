import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ImageSourcePropType } from 'react-native';
import { Colors } from '@/constants/Colors';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  logo: ImageSourcePropType;
}

export function Header({
  title,
  showBack = false,
  logo,
}: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {showBack && (
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={10}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors.text.primary}
          />
        </Pressable>
      )}

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.logoContainer}>
        <Image
          source={logo}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 74,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  logoContainer: {
    position: 'absolute',
    right: 20,
    bottom: 10,
  },

  backButton: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  title: {
    position: 'absolute',
    bottom: 10,
    left: 60,
    right: 60,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },

  logo: {
    width: 40,
    height: 40,
  },
});