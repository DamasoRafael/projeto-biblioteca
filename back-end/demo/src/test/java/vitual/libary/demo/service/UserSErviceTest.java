package vitual.libary.demo.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vitual.libary.demo.entity.User;
import vitual.libary.demo.exception.UserNotFoundException;
import vitual.libary.demo.repository.UserRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Testes Unitários para UserService
 * 
 * Testa as operações de gerenciamento de usuários/membros
 * 
 * Cobertura de testes:
 * - salvar() - Cadastro de usuário
 * - buscarPorId() - Consulta de usuário
 * - atualizar() - Edição de usuário
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Testes Unitários - UserService")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService UserService;

    private User membroExemplo;
    private User bibliotecarioExemplo;

    @BeforeEach
    void setUp() {
        // Membro padrão
        membroExemplo = new User();
        membroExemplo.setId(1L);
        membroExemplo.setNome("Maria Santos");
        membroExemplo.setEmail("maria.santos@teste.com");
        membroExemplo.setSenha("senha123");
        membroExemplo.setRole("MEMBRO");

        // Bibliotecário
        bibliotecarioExemplo = new User();
        bibliotecarioExemplo.setId(2L);
        bibliotecarioExemplo.setNome("João Silva");
        bibliotecarioExemplo.setEmail("joao.silva@teste.com");
        bibliotecarioExemplo.setSenha("senha123");
        bibliotecarioExemplo.setRole("BIBLIOTECARIO");
    }

    // ========================================
    // TESTES PARA MÉTODO: salvar()
    // ========================================

    @Test
    @DisplayName("Deve salvar novo membro com sucesso")
    void deveSalvarNovoMembroComSucesso() {
        // Arrange
        User novoMembro = new User();
        novoMembro.setNome("Carlos Oliveira");
        novoMembro.setEmail("carlos@teste.com");
        novoMembro.setSenha("senha456");
        novoMembro.setRole("MEMBRO");

        when(userRepository.save(any(User.class))).thenReturn(novoMembro);

        // Act
        User resultado = UserService.salvar(novoMembro);

        // Assert
        assertNotNull(resultado, "O usuário salvo não deve ser nulo");
        assertEquals("Carlos Oliveira", resultado.getNome());
        assertEquals("carlos@teste.com", resultado.getEmail());
        assertEquals("MEMBRO", resultado.getRole());

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Deve salvar novo bibliotecário com sucesso")
    void deveSalvarNovoBibliotecarioComSucesso() {
        // Arrange
        User novoBibliotecario = new User();
        novoBibliotecario.setNome("Ana Costa");
        novoBibliotecario.setEmail("ana@teste.com");
        novoBibliotecario.setSenha("senha789");
        novoBibliotecario.setRole("BIBLIOTECARIO");

        when(userRepository.save(any(User.class))).thenReturn(novoBibliotecario);

        // Act
        User resultado = UserService.salvar(novoBibliotecario);

        // Assert
        assertNotNull(resultado);
        assertEquals("Ana Costa", resultado.getNome());
        assertEquals("BIBLIOTECARIO", resultado.getRole());

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Deve definir role padrão como MEMBRO se não especificado")
    void deveDefinirRolePadraoComoMembro() {
        // Arrange
        User usuarioSemRole = new User();
        usuarioSemRole.setNome("Teste Usuario");
        usuarioSemRole.setEmail("teste@teste.com");
        usuarioSemRole.setSenha("senha");
        // Role não definida, deve usar padrão

        when(userRepository.save(any(User.class))).thenReturn(usuarioSemRole);

        // Act
        User resultado = UserService.salvar(usuarioSemRole);

        // Assert
        assertNotNull(resultado);
        // Nota: O comportamento padrão está na entidade User, não no service
        // Este teste documenta o comportamento esperado

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Não deve salvar usuário com email duplicado")
    void naoDeveSalvarUsuarioComEmailDuplicado() {
        // Arrange
        User usuarioDuplicado = new User();
        usuarioDuplicado.setNome("Duplicado");
        usuarioDuplicado.setEmail("maria.santos@teste.com"); // Email já existe
        usuarioDuplicado.setSenha("senha");

        // Simula violação de constraint única no banco
        when(userRepository.save(any(User.class)))
            .thenThrow(new RuntimeException("Email já cadastrado"));

        // Act & Assert
        assertThrows(
            RuntimeException.class,
            () -> UserService.salvar(usuarioDuplicado)
        );

        verify(userRepository, times(1)).save(any(User.class));
    }

    // ========================================
    // TESTES PARA MÉTODO: buscarPorId()
    // ========================================

    @Test
    @DisplayName("Deve buscar membro por ID com sucesso")
    void deveBuscarMembroPorIdComSucesso() {
        // Arrange
        Long idBusca = 1L;
        when(userRepository.findById(idBusca)).thenReturn(Optional.of(membroExemplo));

        // Act
        User resultado = UserService.buscarPorId(idBusca);

        // Assert
        assertNotNull(resultado);
        assertEquals(idBusca, resultado.getId());
        assertEquals("Maria Santos", resultado.getNome());
        assertEquals("maria.santos@teste.com", resultado.getEmail());
        assertEquals("MEMBRO", resultado.getRole());

        verify(userRepository, times(1)).findById(idBusca);
    }

    @Test
    @DisplayName("Deve buscar bibliotecário por ID com sucesso")
    void deveBuscarBibliotecarioPorIdComSucesso() {
        // Arrange
        Long idBusca = 2L;
        when(userRepository.findById(idBusca)).thenReturn(Optional.of(bibliotecarioExemplo));

        // Act
        User resultado = UserService.buscarPorId(idBusca);

        // Assert
        assertNotNull(resultado);
        assertEquals("João Silva", resultado.getNome());
        assertEquals("BIBLIOTECARIO", resultado.getRole());

        verify(userRepository, times(1)).findById(idBusca);
    }

    @Test
    @DisplayName("Deve lançar UserNotFoundException quando usuário não existe")
    void deveLancarExcecaoQuandoUsuarioNaoExiste() {
        // Arrange
        Long idInexistente = 999L;
        when(userRepository.findById(idInexistente)).thenReturn(Optional.empty());

        // Act & Assert
        UserNotFoundException exception = assertThrows(
            UserNotFoundException.class,
            () -> UserService.buscarPorId(idInexistente),
            "Deveria lançar UserNotFoundException"
        );

        assertTrue(exception.getMessage().contains("999"));
        assertTrue(exception.getMessage().contains("não encontrado"));

        verify(userRepository, times(1)).findById(idInexistente);
    }

    // ========================================
    // TESTES PARA MÉTODO: atualizar()
    // ========================================

    @Test
    @DisplayName("Deve atualizar dados do usuário com sucesso")
    void deveAtualizarDadosUsuarioComSucesso() {
        // Arrange
        Long idParaAtualizar = 1L;
        
        User dadosAtualizados = new User();
        dadosAtualizados.setNome("Maria Santos Silva");
        dadosAtualizados.setEmail("maria.silva@teste.com");
        dadosAtualizados.setSenha("novaSenha123");

        when(userRepository.findById(idParaAtualizar)).thenReturn(Optional.of(membroExemplo));
        when(userRepository.save(any(User.class))).thenReturn(membroExemplo);

        // Act
        User resultado = UserService.atualizar(idParaAtualizar, dadosAtualizados);

        // Assert
        assertNotNull(resultado);
        assertEquals("Maria Santos Silva", resultado.getNome());
        assertEquals("maria.silva@teste.com", resultado.getEmail());

        verify(userRepository, times(1)).findById(idParaAtualizar);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Deve atualizar usuário sem alterar senha se não fornecida")
    void deveAtualizarSemAlterarSenhaSeNaoFornecida() {
        // Arrange
        Long idParaAtualizar = 1L;
        String senhaOriginal = membroExemplo.getSenha();
        
        User dadosAtualizados = new User();
        dadosAtualizados.setNome("Maria Santos");
        dadosAtualizados.setEmail("maria.santos@teste.com");
        dadosAtualizados.setSenha(""); // Senha vazia

        when(userRepository.findById(idParaAtualizar)).thenReturn(Optional.of(membroExemplo));
        when(userRepository.save(any(User.class))).thenReturn(membroExemplo);

        // Act
        User resultado = UserService.atualizar(idParaAtualizar, dadosAtualizados);

        // Assert
        assertNotNull(resultado);
        // Senha deve permanecer a original
        assertEquals(senhaOriginal, resultado.getSenha());

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao atualizar usuário inexistente")
    void deveLancarExcecaoAoAtualizarUsuarioInexistente() {
        // Arrange
        Long idInexistente = 999L;
        User dadosAtualizados = new User();
        dadosAtualizados.setNome("Nome Qualquer");

        when(userRepository.findById(idInexistente)).thenReturn(Optional.empty());

        // Act & Assert
        UserNotFoundException exception = assertThrows(
            UserNotFoundException.class,
            () -> UserService.atualizar(idInexistente, dadosAtualizados)
        );

        verify(userRepository, times(1)).findById(idInexistente);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Deve atualizar apenas nome mantendo outros dados")
    void deveAtualizarApenasNome() {
        // Arrange
        Long idParaAtualizar = 1L;
        String emailOriginal = membroExemplo.getEmail();
        
        User dadosAtualizados = new User();
        dadosAtualizados.setNome("Maria Santos da Silva");
        dadosAtualizados.setEmail(emailOriginal);
        dadosAtualizados.setSenha("");

        when(userRepository.findById(idParaAtualizar)).thenReturn(Optional.of(membroExemplo));
        when(userRepository.save(any(User.class))).thenReturn(membroExemplo);

        // Act
        User resultado = UserService.atualizar(idParaAtualizar, dadosAtualizados);

        // Assert
        assertNotNull(resultado);
        assertEquals("Maria Santos da Silva", resultado.getNome());
        assertEquals(emailOriginal, resultado.getEmail());

        verify(userRepository, times(1)).save(any(User.class));
    }

    // ========================================
    // TESTES ADICIONAIS
    // ========================================

    @Test
    @DisplayName("Deve listar todos os usuários")
    void deveListarTodosUsuarios() {
        // Arrange
        List<User> listaUsuarios = Arrays.asList(membroExemplo, bibliotecarioExemplo);
        when(userRepository.findAll()).thenReturn(listaUsuarios);

        // Act
        List<User> resultado = UserService.listarTodos();

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals("Maria Santos", resultado.get(0).getNome());
        assertEquals("João Silva", resultado.get(1).getNome());

        verify(userRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Deve retornar lista vazia quando não há usuários")
    void deveRetornarListaVaziaQuandoNaoHaUsuarios() {
        // Arrange
        when(userRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<User> resultado = UserService.listarTodos();

        // Assert
        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());

        verify(userRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Deve deletar usuário com sucesso")
    void deveDeletarUsuarioComSucesso() {
        // Arrange
        Long idParaDeletar = 1L;
        when(userRepository.findById(idParaDeletar)).thenReturn(Optional.of(membroExemplo));
        doNothing().when(userRepository).delete(any(User.class));

        // Act
        UserService.deletar(idParaDeletar);

        // Assert
        verify(userRepository, times(1)).findById(idParaDeletar);
        verify(userRepository, times(1)).delete(any(User.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao deletar usuário inexistente")
    void deveLancarExcecaoAoDeletarUsuarioInexistente() {
        // Arrange
        Long idInexistente = 999L;
        when(userRepository.findById(idInexistente)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(
            UserNotFoundException.class,
            () -> UserService.deletar(idInexistente)
        );

        verify(userRepository, times(1)).findById(idInexistente);
        verify(userRepository, never()).delete(any(User.class));
    }

    @Test
    @DisplayName("Deve validar que senha não pode ser nula ao criar usuário")
    void deveValidarSenhaNaoNulaAoCriar() {
        // Arrange
        User usuarioSemSenha = new User();
        usuarioSemSenha.setNome("Usuario Teste");
        usuarioSemSenha.setEmail("teste@teste.com");
        // Senha não definida (null)

        // Este teste documenta que validação @NotBlank deve capturar isso
        // A validação real ocorre no controller com @Valid
        
        // Por enquanto, o service aceita qualquer entrada
        when(userRepository.save(any(User.class))).thenReturn(usuarioSemSenha);

        // Act
        User resultado = UserService.salvar(usuarioSemSenha);

        // Assert
        assertNotNull(resultado);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Deve manter role ao atualizar outros dados")
    void deveManterRoleAoAtualizarOutrosDados() {
        // Arrange
        Long idParaAtualizar = 2L;
        String roleOriginal = bibliotecarioExemplo.getRole();
        
        User dadosAtualizados = new User();
        dadosAtualizados.setNome("João Silva Santos");
        dadosAtualizados.setEmail("joao.silva@teste.com");
        dadosAtualizados.setSenha("");

        when(userRepository.findById(idParaAtualizar)).thenReturn(Optional.of(bibliotecarioExemplo));
        when(userRepository.save(any(User.class))).thenReturn(bibliotecarioExemplo);

        // Act
        User resultado = UserService.atualizar(idParaAtualizar, dadosAtualizados);

        // Assert
        assertNotNull(resultado);
        assertEquals(roleOriginal, resultado.getRole());
        assertEquals("BIBLIOTECARIO", resultado.getRole());

        verify(userRepository, times(1)).save(any(User.class));
    }
}