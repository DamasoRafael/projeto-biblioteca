package vitual.libary.demo.service;

import org.springframework.stereotype.Service;
import vitual.libary.demo.entity.User;
import vitual.libary.demo.exception.UserNotFoundException;
import vitual.libary.demo.repository.UserRepository;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> listarTodos() {
        return userRepository.findAll();
    }

    public User buscarPorId(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado com ID: " + id));
    }

    public User salvar(User user) {
        return userRepository.save(user);
    }

    public User atualizar(Long id, User dados) {
        User existente = buscarPorId(id);

        existente.setNome(dados.getNome());
        existente.setEmail(dados.getEmail());

        return userRepository.save(existente);
    }

    public void deletar(Long id) {
        User existente = buscarPorId(id);
        userRepository.delete(existente);
    }
}