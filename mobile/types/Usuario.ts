export interface Usuario {
    id: number;
    nome: string;
    telefone: string;
    email: string;
    foto: string | null;
    ativo: boolean;
}