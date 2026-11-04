from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class GerarDescricaoRequest(BaseModel):
    nomeEvento: str
    nivelEvento: str
    categoria: str
    subcategoria: Optional[str] = None
    dataHora: datetime
    endereco: Optional[str] = None
    ultimasDescricoes: list[str] = []


class GerarDescricaoResponse(BaseModel):
    descricao: str