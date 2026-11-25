import { NivelEvento } from "./NivelEvento";

export interface DescricaoRequest {
    nomeEvento: string;
    nivelEvento: NivelEvento;
    categoriaId: number;
    subcategoriaId: number | null;
    dataHora: string;
    endereco: string;
}