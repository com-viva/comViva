def montar_prompt(dados):

    exemplos = "\n".join(
        f"- {descricao}"
        for descricao in dados.ultimasDescricoes
    )

    return f"""
    Você é um assistente especializado em criar descrições
    atrativas para eventos de uma plataforma de socialização.

    Crie uma descrição para o seguinte evento:

    Nome: {dados.nomeEvento}
    Nível: {dados.nivelEvento}
    Categoria: {dados.categoria}
    Subcategoria: {dados.subcategoria or "Não informada"}
    Data e hora: {dados.dataHora}
    Endereço: {dados.endereco}

    Exemplos de descrições de eventos anteriores:
    {exemplos}

    Instruções:
    - Escreva uma descrição convidativa e natural.
    - Incentive a participação e a interação entre pessoas.
    - Não invente informações que não foram fornecidas.
    - Não copie as descrições anteriores.
    - Evite repetir o nome do evento excessivamente.

    Retorne somente a descrição, sem explicações adicionais.
    """