import { NivelEvento } from "./NivelEvento";

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
