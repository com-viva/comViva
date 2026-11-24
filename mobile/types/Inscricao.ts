export interface Inscricao {
    id: number, 
    status: StatusInscricao, 
    usuarioId: number, 
    eventoId: number
}

export type StatusInscricao =
  | 'REALIZADA'
  | 'CANCELADA';
