package com.comviva.dto;

import java.time.LocalDateTime;

import com.comviva.domain.Categoria;
import com.comviva.domain.Subcategoria;
import com.comviva.enums.NivelEvento;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EventoRequestDTO(

    @NotBlank(message = "O nome é obrigatório", groups = Criar.class)
    String nome,

    @NotBlank(message = "A descrição é obrigatória", groups = Criar.class)
    String descricao,

    @NotNull(message = "A data é obrigatória", groups = Criar.class)
    @Future(message = "A data do evento deve ser em uma data futura", groups = { Criar.class, Atualizar.class })
    LocalDateTime dataHora,

    @NotNull(message = "A capacidade mínima é obrigatória", groups = Criar.class)
    Long capacidadeMin,

    @NotNull(message = "A capacidade máxima é obrigatória", groups = Criar.class)
    Long capacidadeMax,

    @NotBlank(message = "O endereço é obrigatório", groups = Criar.class)
    String endereco,

    @NotNull(message = "O nível é obrigatório", groups = Criar.class)
    NivelEvento nivel,

    @NotNull(message = "A categoria é obrigatória", groups = Criar.class)
    Categoria categoria,

    Subcategoria subcategoria
) {}
