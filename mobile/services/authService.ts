import { api } from "./api";

interface LoginRequest {
    email: string;
    senha: string;
}

export async function login(dados: LoginRequest) {
    const response = await api.post(
        "/auth/login",
        dados
    );

    return response.data;
}