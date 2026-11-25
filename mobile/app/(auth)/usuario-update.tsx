
import { useUsuarios } from '@/hooks/useUsuarios';
import { Input } from '@/components/generic-input';
import { Button } from '@/components/generic-button';
import { Colors } from '@/constants/Colors';
import { UsuarioRequest, UsuarioUpdateRequest } from '@/types/UsuarioRequest';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function UsuarioScreen() {

    const { modo } = useLocalSearchParams<{ modo?: string }>();

    const isEdicao = modo === 'edicao';

    const { usuario, loading, carregarUsuarioLogado, criar, atualizar } = useUsuarios();

    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [foto, setFoto] = useState<string | null>(null);

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [salvando, setSalvando] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (!isEdicao) {
                setNome('');
                setTelefone('');
                setEmail('');
                setSenha('');
                setFoto(null);
                return;
            }

            const carregarDados = async () => {
                try {
                    const dados = await carregarUsuarioLogado();

                    setNome(dados.nome);
                    setTelefone(dados.telefone);
                    setEmail(dados.email);
                    setFoto(dados.foto);

                } catch (error) {
                    console.error('Erro ao carregar usuário:', error);
                    Alert.alert(
                        'Erro',
                        'Não foi possível carregar os dados do usuário.'
                    );
                }
            };

            carregarDados();

        }, [isEdicao, carregarUsuarioLogado])
    );

    const selecionarFoto = async () => {
        try {
            const permissao =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissao.granted) {
                Alert.alert(
                    'Permissão necessária',
                    'Permita o acesso à galeria para selecionar uma foto.'
                );
                return;
            }

            const resultado =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['images'],
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.7,
                    base64: true,
                });

            if (
                !resultado.canceled &&
                resultado.assets[0].base64
            ) {
                const imagem = resultado.assets[0];

                const imagemBase64 =
                    `data:${imagem.mimeType ?? 'image/jpeg'};base64,${imagem.base64}`;

                setFoto(imagemBase64);
            }

        } catch (error) {
            console.error('Erro ao selecionar foto:', error);

            Alert.alert(
                'Erro',
                'Não foi possível selecionar a imagem.'
            );
        }
    };

    const formatarTelefone = (valor: string) => {
        const numeros = valor.replace(/\D/g, '').slice(0, 11);

        if (numeros.length === 0) return '';

        if (numeros.length <= 2) {
            return `(${numeros}`;
        }

        if (numeros.length <= 7) {
            return `(${numeros.slice(0, 2)})${numeros.slice(2)}`;
        }

        return `(${numeros.slice(0, 2)})${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    };

    const salvarUsuario = async () => {

        if (
            !nome.trim() ||
            !telefone.trim() ||
            !email.trim()
        ) {
            Alert.alert(
                'Atenção',
                'Preencha todos os campos obrigatórios.'
            );
            return;
        }

        if (!isEdicao && !senha.trim()) {
            Alert.alert(
                'Atenção',
                'Informe uma senha para sua conta.'
            );
            return;
        }

        if (senha.trim() && senha.length < 6) {
            Alert.alert(
                'Atenção',
                'A senha deve possuir pelo menos 6 caracteres.'
            );
            return;
        }

        try {
            setSalvando(true);

            if (isEdicao) {

                if (!usuario) {
                    Alert.alert('Erro', 'Usuário não encontrado.');
                    return;
                }

                const dados: UsuarioUpdateRequest = { nome, telefone: telefone.replace(/\D/g, ''), email, foto };

                await atualizar(usuario.id, dados);

                Alert.alert(
                    'Sucesso',
                    'Dados atualizados com sucesso!',
                    [{ text: 'OK', onPress: () => router.back() }]
                );

            } else {

                const dados: UsuarioRequest = { nome, telefone: telefone.replace(/\D/g, ''), email, foto, senha };

                await criar(dados);

                Alert.alert(
                    'Sucesso',
                    'Conta criada com sucesso!',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
            }

        } catch (error) {
            console.error('Erro ao salvar usuário:', error);

            Alert.alert(
                'Erro',
                'Não foi possível salvar os dados do usuário.'
            );

        } finally {
            setSalvando(false);
        }
    };

    const carregando = loading || salvando;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.titulo}>
                {isEdicao ? 'Edite seu perfil' : 'Crie sua conta'}
            </Text>

            <View style={styles.form}>

                <View style={styles.fotoContainer}>
                    <Pressable
                        onPress={selecionarFoto}
                        style={styles.fotoPressable}
                    >
                        {foto ? (
                            <Image
                                source={{ uri: foto }}
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

                        <View style={styles.fotoIcone}>
                            <AntDesign
                                name="camera"
                                size={18}
                                color="#FFFFFF"
                            />
                        </View>
                    </Pressable>

                    <Text style={styles.fotoTexto}>
                        Adicionar foto de perfil
                    </Text>
                </View>

                <Input
                    label="Nome completo"
                    value={nome}
                    onChangeText={setNome}
                    maxLength={255}
                />

                <Input
                    label="Telefone"
                    value={telefone}
                    onChangeText={(valor) => setTelefone(formatarTelefone(valor))}
                    keyboardType="phone-pad"
                    maxLength={14}
                />

                <Input
                    label="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {!isEdicao && (
                    <View style={styles.senhaContainer}>
                        <View style={styles.senhaInput}>
                            <Input
                                label='Senha'
                                value={senha}
                                onChangeText={setSenha}
                                secureTextEntry={!mostrarSenha}
                                maxLength={100}
                            />
                        </View>
                        <Pressable
                            style={styles.senhaIcone}
                            onPress={() => setMostrarSenha(!mostrarSenha)}
                        >
                            <AntDesign name={mostrarSenha ? "eye-invisible" : "eye"} size={22} color={Colors.text.secondary} />
                        </Pressable>
                    </View>
                )}


                <View style={styles.buttonContainer}>
                    <Button
                        title={isEdicao
                            ? 'Salvar alterações'
                            : 'Criar conta'}
                        onPress={salvarUsuario}
                        loading={carregando}
                        disabled={carregando}
                    />
                </View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
        paddingTop: 12,
    },

    content: {
        paddingBottom: 30,
    },

    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.text.primary,
        textTransform: 'uppercase',
    },

    form: {
        gap: 20,
    },

    fotoContainer: {
        alignItems: 'center',
        marginVertical: 10,
        gap: 10,
    },

    fotoPressable: {
        position: 'relative',
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

    fotoIcone: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary.start,
        justifyContent: 'center',
        alignItems: 'center',
    },

    fotoTexto: {
        color: Colors.text.secondary,
        fontSize: 13,
    },

    senhaContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
    },

    senhaIcone: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 4,
    },

    senhaInput: {
        flex: 1,
    },

    senhaTexto: {
        color: Colors.primary.start,
        fontSize: 13,
    },

    buttonContainer: {
        marginTop: 16,
    },
});
