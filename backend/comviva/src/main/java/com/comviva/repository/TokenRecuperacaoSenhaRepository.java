
package com.comviva.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.comviva.domain.TokenRecuperacaoSenha;

import jakarta.persistence.LockModeType;

public interface TokenRecuperacaoSenhaRepository
        extends JpaRepository<TokenRecuperacaoSenha, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT t
            FROM TokenRecuperacaoSenha t
            WHERE t.tokenHash = :tokenHash
              AND t.utilizado = false
            """)
    Optional<TokenRecuperacaoSenha> findTokenValidoParaUso(
            @Param("tokenHash") String tokenHash);

    List<TokenRecuperacaoSenha> findByUsuarioIdAndUtilizadoFalse(
            Long usuarioId);
}
