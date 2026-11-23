export interface Evento {
  id: number;
  nome: string;
  descricao: string;
  dataHora: string;
  dataHoraFim: string;
  capacidadeMin: number;
  capacidadeMax: number;
  endereco: string;
  status: StatusEvento;
  nivel: NivelEvento;
  categoria: string;
  subcategoria: string | null;
  usuarioId: number;
}

export type StatusEvento =
  | 'AGENDADO'
  | 'CANCELADO'
  | 'CONCLUIDO';

export type NivelEvento =
  | 'INICIANTE'
  | 'INTERMEDIARIO'
  | 'AVANCADO';