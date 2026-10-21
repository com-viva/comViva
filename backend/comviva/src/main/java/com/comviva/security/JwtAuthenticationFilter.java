package com.comviva.security;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;

    private final JwtAuthenticationEntryPoint authenticationEntryPoint;

    public JwtAuthenticationFilter(JwtService jwtService, JwtAuthenticationEntryPoint authenticationEntryPoint) {
        this.jwtService = jwtService;
        this.authenticationEntryPoint = authenticationEntryPoint;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = resolveToken(request);

        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                Claims claims = jwtService.validateToken(token);

                UsuarioPrincipal principal = new UsuarioPrincipal(
                        jwtService.extractUserId(claims),
                        jwtService.extractEmail(claims));

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        principal, null, List.of());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (JwtException | IllegalArgumentException ex) {
                SecurityContextHolder.clearContext();
                authenticationEntryPoint.commence(request, response,
                        new BadCredentialsException("Token de acesso inválido ou expirado.", ex));
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            return null;
        }

        String token = header.substring(BEARER_PREFIX.length()).trim();
        return token.isEmpty() ? null : token;
    }
}
