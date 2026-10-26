package com.comviva.dto;

import com.comviva.domain.Categoria;
import com.comviva.domain.Subcategoria;

public record InteresseUsuarioRequestDTO (Categoria categoria, Subcategoria subcategoria) {}
