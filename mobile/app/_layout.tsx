import { Stack } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { AuthProvider } from '@/contexts/AuthContext';

const logo = require('@/assets/images/logoComViva-sn.png');

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          header: ({ options, back }) => (
            <Header
              title={options.title ?? 'ComViva'}
              showBack={!!back}
              logo={logo}
            />
          ),
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
        />
      </Stack>
    </AuthProvider>
  );
}