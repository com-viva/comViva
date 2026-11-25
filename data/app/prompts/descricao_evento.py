def montar_prompt(dados):

    exemplos = "\n".join(
        f"- {descricao}"
        for descricao in dados.ultimasDescricoes
    )

    return f"""
        Você é um assistente especializado em escrever legendas atrativas para eventos de uma plataforma de socialização e encontros presenciais.

        Crie uma legenda convidativa para o evento abaixo:

        <dados_evento>
        Nome: {dados.nomeEvento}
        Nível de experiência/dificuldade: {dados.nivelEvento}
        Categoria: {dados.categoria}
        Subcategoria: {dados.subcategoria or "Não informada"}
        Data e hora: {dados.dataHora}
        Local/Endereço: {dados.endereco}
        </dados_evento>

        <exemplos_de_tom>
        {exemplos or "Nenhum exemplo disponível. Mantenha um tom acolhedor, leve e direto."}
        </exemplos_de_tom>

        Regras obrigatórias:
        - Escreva em português, com tom natural, acolhedor e focado especificamente no tema do evento (evite frases genéricas).
        - Incentive a interação e a conexão entre os participantes, adequando o convite ao nível informado.
        - Use os dados de data, hora e local apenas para contextualizar o convite de forma fluida, sem precisar copiar o endereço completo.
        - Nunca invente informações, atrações ou regras que não estejam nos dados fornecidos.
        - Não repita o nome do evento mais de uma vez e não copie os textos dos exemplos.
        - Mantenha o texto curto, com no máximo 450 caracteres (incluindo espaços).

        Retorne exclusivamente o texto da legenda, sem aspas, títulos ou explicações.
    """