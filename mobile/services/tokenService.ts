import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "comviva_token";

export async function salvarToken(token: string) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function obterToken() {
    return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function removerToken() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}