package com.comviva.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.comviva.domain.Usuario;


public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<List<Usuario>> findByNome(String nome);

    Optional<Usuario> findByEmail(String email);
    
    Boolean existsByEmail(String email);

    @Modifying 
    @Query ("UPDATE Usuario u set u.ativo = false WHERE u.id = :id")
    Integer deactivateById(@Param("id") Long id);
}
