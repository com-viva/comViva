import { Usuario } from "./Usuario";

export interface UsuarioInscrito {
    id: number;
    status: 'REALIZADA' | 'CANCELADA';
    usuario: Usuario;
}