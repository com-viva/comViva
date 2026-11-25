import { useUsuarios } from '@/hooks/useUsuarios';
import { Button } from '@/components/generic-button';
import { Colors } from '@/constants/Colors';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { removerToken } from '@/services/tokenService';

export default function Perfil() {

    const { usuario, carregarUsuarioLogado, loading } = useUsuarios();

    useFocusEffect(
        useCallback(() => {
            carregarUsuarioLogado();
        }, [carregarUsuarioLogado])
    );

    function goToEditarPerfil() {
        if (!usuario) return;

        router.push({
            pathname: '/(auth)/usuario-update',
            params: { modo: 'edicao' },
        });
    }

    function goToMeusEventos() {
        router.push('/meus-eventos');
    }

    function goToHistorico() {
        router.push('/historico-inscricoes');
    }

    async function sair() {
        await removerToken();
        router.replace('/(auth)/login');
    }

    return (
        <View style={styles.container}>

            <View style={styles.perfilContainer}>
                {usuario?.foto ? (
                    <Image
                        source={{ uri: usuario.foto }}
                        style={styles.foto}
                    />
                ) : (
                    <View style={styles.fotoPlaceholder}>
                        <AntDesign
                            name="user"
                            size={48}
                            color={Colors.text.secondary}
                        />
                    </View>
                )}

                <Text style={styles.nome}>
                    {usuario?.nome}
                </Text>
            </View>

            <View style={styles.botoesContainer}>
                <Button
                    title="Editar perfil"
                    onPress={goToEditarPerfil}
                    variant="outline"
                />

                <Button
                    title="Meus eventos"
                    onPress={goToMeusEventos}
                    variant="outline"
                />

                <Button
                    title="Histórico de inscrições"
                    onPress={goToHistorico}
                    variant="outline"
                />

                <View style={styles.botaoSair}>
                    <Button
                        title="Sair"
                        onPress={sair}
                        variant="filled"
                    />
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 24,
        justifyContent: 'space-between'
    },

    perfilContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },

    foto: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },

    fotoPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.text.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },

    nome: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginTop: 16,
        textAlign: 'center',
    },

    botoesContainer: {
        flex: 1,
        gap: 16,
        marginTop: 30,
    },

    botaoSair: {
        marginTop: 'auto',
    },
});