package com.comviva.resource;

import com.comviva.dto.LoginRequestDTO;
import com.comviva.dto.LoginResponseDTO;
import com.comviva.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        LoginResponseDTO loginResponseDTO = authService.login(loginRequestDTO.getEmail(), loginRequestDTO.getSenha());
        return ResponseEntity.ok(loginResponseDTO);
    }
}
