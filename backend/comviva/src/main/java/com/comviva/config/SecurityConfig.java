package com.comviva.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.comviva.security.JwtAuthenticationEntryPoint;
import com.comviva.security.JwtAuthenticationFilter;
import com.comviva.security.JwtService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtService jwtService;

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    public SecurityConfig(JwtService jwtService, JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {
        this.jwtService = jwtService;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Instanciado aqui (e não como @Component) para o Spring Boot não
        // registrar o filtro como um servlet filter e executá-lo duas vezes.
        JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(jwtService, jwtAuthenticationEntryPoint);

        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/usuarios").permitAll()
                        // TODO(PRODUTO): o cadastro público está bloqueado até o produto
                        // decidir se POST /api/usuarios deve ser liberado. Remova esta
                        // linha para reativar o auto-cadastro.
                        .requestMatchers(HttpMethod.POST, "/api/usuarios").authenticated()
                        .anyRequest().authenticated())
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
