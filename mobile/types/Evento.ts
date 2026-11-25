import { NivelEvento } from "./NivelEvento";
import { StatusEvento } from "./StatusEvento";

export interface Evento {
  id: number;
  nome: string;
  descricao: string;
  dataHora: string;
  dataHoraFim: string;
  qntdInscritos: number;
  capacidadeMin: number;
  capacidadeMax: number;
  endereco: string;
  status: StatusEvento;
  nivel: NivelEvento;
  categoriaId: number;
  categoria: string;
  subcategoriaId: number;
  subcategoria: string | null;
  usuarioId: number;
}
