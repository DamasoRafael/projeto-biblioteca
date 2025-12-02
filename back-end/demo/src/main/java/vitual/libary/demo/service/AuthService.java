package vitual.libary.demo.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vitual.libary.demo.dto.AuthRequest;
import vitual.libary.demo.dto.AuthResponse;
import vitual.libary.demo.dto.RegisterRequest;
import vitual.libary.demo.entity.User;
import vitual.libary.demo.exception.UserNotFoundException;
import vitual.libary.demo.repository.UserRepository;
import vitual.libary.demo.security.JwtTokenProvider;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    
    /**
     * Registra um novo usuário
     */
    public AuthResponse registrar(RegisterRequest request) {
        // Verifica se email já existe
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email já registrado: " + request.getEmail());
        }
        
        // Cria novo usuário
        User user = new User();
        user.setNome(request.getNome());
        user.setEmail(request.getEmail());
        user.setSenha(passwordEncoder.encode(request.getSenha()));
        user.setRole(request.getRole() != null ? request.getRole() : "MEMBRO");
        
        User savedUser = userRepository.save(user);
        
        // Gera token JWT
        String token = jwtTokenProvider.generateToken(savedUser);
        
        return new AuthResponse(token, savedUser.getId(), savedUser.getNome(), savedUser.getEmail(), savedUser.getRole());
    }
    
    /**
     * Faz login de um usuário
     */
    public AuthResponse login(AuthRequest request) {
        // Busca usuário por email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado com email: " + request.getEmail()));
        
        // Valida senha
        if (!passwordEncoder.matches(request.getSenha(), user.getSenha())) {
            throw new IllegalArgumentException("Senha incorreta");
        }
        
        // Gera token JWT
        String token = jwtTokenProvider.generateToken(user);
        
        return new AuthResponse(token, user.getId(), user.getNome(), user.getEmail(), user.getRole());
    }
}
