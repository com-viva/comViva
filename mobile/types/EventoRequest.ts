export interface EventoRequest {
  nome: string;
  descricao: string;
  dataHora: string;
  capacidadeMin: number;
  capacidadeMax: number;
  endereco: string;
  nivel: NivelEvento;
  categoriaId: number;
  subcategoriaId: number | null;
}

export type StatusEvento =
  | 'AGENDADO'
  | 'CANCELADO'
  | 'CONCLUIDO';

export type NivelEvento =
  | 'INICIANTE'
  | 'INTERMEDIARIO'
  | 'AVANCADO';