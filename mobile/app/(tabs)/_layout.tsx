
import { Tabs } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const logo = require('@/assets/images/logoComViva-sn.png');

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: ({ options }) => (
          <Header
            title={options.title ?? 'ComViva'}
            logo={logo}
          />
        ),

        tabBarStyle: {
          height: 68,
          backgroundColor: Colors.background,
          borderTopWidth: 0,

          paddingTop: 8,
          paddingBottom: 8,

          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 3,
        },

        tabBarActiveTintColor: Colors.primary.start,
        tabBarInactiveTintColor: Colors.text.secondary,

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={String(color)} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="inscricoes-evento"
        options={{
          title: 'Minhas inscrições',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={String(color)} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="eventos-update"
        options={{
          title: 'Criar evento',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color={String(color)} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={String(color)} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
