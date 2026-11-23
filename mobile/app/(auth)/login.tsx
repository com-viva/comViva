
import { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { router } from "expo-router";

import { Button } from "@/components/generic-button";
import { Colors } from "@/constants/Colors";
import { login } from "@/services/authService";
import { salvarToken } from "@/services/tokenService";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleLogin() {
        if (!email.trim() || !senha) {
            Alert.alert("Atenção", "Preencha seu e-mail e sua senha.");
            return;
        }

        try {
            setCarregando(true);

            const resultado = await login({
                email: email.trim(),
                senha,
            });

            await salvarToken(resultado.token);

            router.replace("/(tabs)");
        } catch (erro) {
            Alert.alert(
                "Não foi possível entrar",
                erro instanceof Error ? erro.message : "Tente novamente."
            );
        } finally {
            setCarregando(false);
        }
    }
    function irParaCadastro() {
        router.push("/usuario-update");
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Image
                    source={require("../../assets/images/logoComViva.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="EMAIL"
                            placeholderTextColor="#000000"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <View style={styles.inputLine} />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="SENHA"
                            placeholderTextColor="#000000"
                            value={senha}
                            onChangeText={setSenha}
                            secureTextEntry
                            autoCapitalize="none"
                        />

                        <View style={styles.inputLine} />
                    </View>
                </View>

                <View style={styles.loginButton}>
                    <Button
                        title="ENTRAR"
                        onPress={handleLogin}
                        variant="filled"
                        loading={carregando}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Ainda não tem uma conta?
                    </Text>

                    <Button
                        title="CRIAR CONTA"
                        onPress={irParaCadastro}
                        variant="outline"
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: 33,
        paddingTop: 35,
        paddingBottom: 30,
    },

    logo: {
        width: 190,
        height: 145,
        alignSelf: "center",
    },

    form: {
        marginTop: 52,
        gap: 43,
    },

    inputContainer: {
        width: "100%",
    },

    input: {
        height: 30,
        paddingHorizontal: 0,
        paddingVertical: 0,
        color: "#000000",
        fontSize: 14,
        fontWeight: "900",
    },

    inputLine: {
        height: 2.5,
        width: "100%",
        backgroundColor: Colors.primary.start,
    },

    loginButton: {
        marginTop: 60,
    },

    footer: {
        marginTop: "auto",
        paddingTop: 55,
        gap: 4,
    },

    footerText: {
        color: "#000000",
        textAlign: "center",
        fontSize: 10,
        fontWeight: "800",
    },
});
