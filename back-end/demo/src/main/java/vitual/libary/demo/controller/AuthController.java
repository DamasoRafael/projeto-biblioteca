package vitual.libary.demo.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vitual.libary.demo.dto.AuthRequest;
import vitual.libary.demo.dto.AuthResponse;
import vitual.libary.demo.dto.RegisterRequest;
import vitual.libary.demo.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthService authService;
    
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    
    /**
     * POST /api/auth/register
     * Registra um novo usuário
     * 
     * Body esperado:
     * {
     *   "nome": "João Silva",
     *   "email": "joao@example.com",
     *   "senha": "senha123"
     * }
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registrar(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.registrar(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    /**
     * POST /api/auth/login
     * Faz login de um usuário
     * 
     * Body esperado:
     * {
     *   "email": "joao@example.com",
     *   "senha": "senha123"
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
