from google import genai
from app.config import GEMINI_API_KEY, GEMINI_MODEL


client = genai.Client(api_key=GEMINI_API_KEY)


def gerar_com_gemini(prompt: str) -> str:

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt
    )

    if not response.text:
        raise RuntimeError("O Gemini não retornou uma descrição.")

    return response.text.strip()