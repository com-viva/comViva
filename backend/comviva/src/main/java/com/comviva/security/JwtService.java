package com.comviva.security;

import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.comviva.domain.Usuario;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final String CLAIM_USER_ID = "uid";

    private final SecretKey secretKey;

    private final Long expirationMs;

    private final String issuer;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.expiration-ms}") Long expirationMs,
                      @Value("${jwt.issuer}") String issuer) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.expirationMs = expirationMs;
        this.issuer = issuer;
    }

    public String generateToken(Usuario usuario) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(usuario.getEmail())
                .issuer(issuer)
                .claim(CLAIM_USER_ID, usuario.getId())
                .issuedAt(now)
                .expiration(expiration)
                .signWith(secretKey)
                .compact();
    }

    public Claims validateToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .requireIssuer(issuer)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmail(Claims claims) {
        return claims.getSubject();
    }

    public Long extractUserId(Claims claims) {
        Object userId = claims.get(CLAIM_USER_ID);
        return userId == null ? null : Long.valueOf(userId.toString());
    }
}
