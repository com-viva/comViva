import { Tabs } from 'expo-router';
import { Header } from '@/components/layout/Header';

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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
        }}
      />
    </Tabs>
  );
}