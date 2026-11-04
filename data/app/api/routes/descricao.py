import logging

from fastapi import APIRouter, HTTPException, Request
from app.schemas.descricao_schema import GerarDescricaoRequest, GerarDescricaoResponse
from app.services.descricao_service import gerar_descricao

router = APIRouter()

logger = logging.getLogger(__name__)

@router.post("/gerar-descricao", response_model=GerarDescricaoResponse)
async def gerar(request: Request, dados: GerarDescricaoRequest):
    print("Content-Type:", request.headers.get("content-type"))
    print("Dados recebidos:", dados.model_dump())

    try:
        descricao = gerar_descricao(dados)
        return GerarDescricaoResponse(descricao=descricao)

    except Exception as e:
        logger.exception("Erro ao gerar descrição do evento")
        raise HTTPException(
            status_code=502,
            detail="Não foi possível gerar a descrição do evento."
        ) from e
