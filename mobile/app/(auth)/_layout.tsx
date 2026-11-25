import { Header } from "@/components/layout/Header";
import { Stack } from "expo-router";

const logo = require('@/assets/images/logoComViva-sn.png');

export default function AuthLayout() {
    return (
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
                name="login"
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="usuario-update"
                options={{ headerShown: true,  }}
            />

        </Stack>
    );
}