from fastapi import FastAPI
from app.api.routes import descricao

app = FastAPI(
    title="ComViva - Serviço de Inteligência Artificial"
)

app.include_router(
    descricao.router,
    prefix="/api",
    tags=["Descrição de Eventos"]
) 