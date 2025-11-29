package vitual.libary.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vitual.libary.demo.entity.User;
import vitual.libary.demo.service.UserService;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // POST /api/users - CREATE
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        User savedUser = userService.salvar(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED); // Status 201
    }

    // GET /api/users - READ ALL
    @GetMapping
    public List<User> getAllUsers() {
        return userService.listarTodos(); // Status 200
    }

    // GET /api/users/{id} - READ ONE
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.buscarPorId(id); // Status 200 ou 404
    }

    // PUT /api/users/{id} - UPDATE
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @Valid @RequestBody User userDetails) {
        return userService.atualizar(id, userDetails); // Status 200 ou 404
    }

    // DELETE /api/users/{id} - DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deletar(id);
        return ResponseEntity.noContent().build(); // Status 204
    }
}