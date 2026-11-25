export interface UsuarioRequest {
    nome: string;
    telefone: string;
    email: string;
    foto: string | null;
    senha: string;
}

export interface UsuarioUpdateRequest {
    nome: string;
    telefone: string;
    email: string;
    foto: string | null;
}