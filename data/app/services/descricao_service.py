from app.prompts.descricao_evento import montar_prompt
from app.services.gemini_service import gerar_com_gemini


def gerar_descricao(dados):

    prompt = montar_prompt(dados)

    descricao = gerar_com_gemini(prompt)

    return descricao