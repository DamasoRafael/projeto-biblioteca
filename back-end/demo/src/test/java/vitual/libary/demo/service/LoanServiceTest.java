package vitual.libary.demo.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vitual.libary.demo.entity.Book;
import vitual.libary.demo.entity.Loan;
import vitual.libary.demo.entity.User;
import vitual.libary.demo.exception.BookNotFoundException;
import vitual.libary.demo.exception.InsufficientStockException;
import vitual.libary.demo.repository.LoanRepository;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Testes Unitários para LoanService
 * 
 * Testa as operações críticas de empréstimo envolvendo 3 tabelas:
 * - Loans (Empréstimos)
 * - Books (Livros)
 * - Users (Usuários)
 * 
 * Cobertura de testes:
 * - emprestar() - Realizar empréstimo
 * - devolver() - Registrar devolução
 * - atualizar() - Editar empréstimo
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Testes Unitários - LoanService")
class LoanServiceTest {

    @Mock
    private LoanRepository loanRepository;

    @Mock
    private BookService bookService;

    @Mock
    private UserService userService;

    @InjectMocks
    private LoanService LoanService;

    private Book livroDisponivel;
    private Book livroEsgotado;
    private User usuario;
    private Loan emprestimoAtivo;

    @BeforeEach
    void setUp() {
        // Livro com estoque disponível
        livroDisponivel = new Book();
        livroDisponivel.setId(1L);
        livroDisponivel.setTitulo("Dom Casmurro");
        livroDisponivel.setAutor("Machado de Assis");
        livroDisponivel.setQuantidadeTotal(5);
        livroDisponivel.setQuantidadeDisponivel(3);

        // Livro sem estoque
        livroEsgotado = new Book();
        livroEsgotado.setId(2L);
        livroEsgotado.setTitulo("Livro Esgotado");
        livroEsgotado.setAutor("Autor Teste");
        livroEsgotado.setQuantidadeTotal(5);
        livroEsgotado.setQuantidadeDisponivel(0);

        // Usuário
        usuario = new User();
        usuario.setId(1L);
        usuario.setNome("Maria Santos");
        usuario.setEmail("maria@teste.com");
        usuario.setRole("MEMBRO");

        // Empréstimo ativo
        emprestimoAtivo = new Loan();
        emprestimoAtivo.setId(1L);
        emprestimoAtivo.setBook(livroDisponivel);
        emprestimoAtivo.setUser(usuario);
        emprestimoAtivo.setLoanDate(LocalDate.now());
        emprestimoAtivo.setReturned(false);
    }

    // ========================================
    // TESTES PARA MÉTODO: emprestar()
    // ========================================

    @Test
    @DisplayName("Deve realizar empréstimo com sucesso")
    void deveRealizarEmprestimoComSucesso() {
        // Arrange
        Long bookId = 1L;
        Long userId = 1L;

        when(bookService.buscarPorId(bookId)).thenReturn(livroDisponivel);
        when(userService.buscarPorId(userId)).thenReturn(usuario);
        when(loanRepository.findByBookIdAndReturnedFalse(bookId)).thenReturn(Optional.empty());
        when(loanRepository.save(any(Loan.class))).thenReturn(emprestimoAtivo);
        when(bookService.salvar(any(Book.class))).thenReturn(livroDisponivel);

        // Act
        Loan resultado = LoanService.emprestar(bookId, userId);

        // Assert
        assertNotNull(resultado, "O empréstimo não deve ser nulo");
        assertEquals(livroDisponivel, resultado.getBook());
        assertEquals(usuario, resultado.getUser());
        assertEquals(LocalDate.now(), resultado.getLoanDate());
        assertFalse(resultado.isReturned());

        // Verificar que o estoque foi decrementado
        verify(bookService, times(1)).salvar(any(Book.class));
        verify(loanRepository, times(1)).save(any(Loan.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao emprestar livro sem estoque")
    void deveLancarExcecaoAoEmprestarLivroSemEstoque() {
        // Arrange
        Long bookId = 2L;
        Long userId = 1L;

        when(bookService.buscarPorId(bookId)).thenReturn(livroEsgotado);
        when(userService.buscarPorId(userId)).thenReturn(usuario);

        // Act & Assert
        InsufficientStockException exception = assertThrows(
            InsufficientStockException.class,
            () -> LoanService.emprestar(bookId, userId),
            "Deveria lançar InsufficientStockException"
        );

        assertTrue(exception.getMessage().contains("Não há exemplares disponíveis"));
        assertTrue(exception.getMessage().contains("Livro Esgotado"));

        // Verificar que NÃO salvou o empréstimo
        verify(loanRepository, never()).save(any(Loan.class));
        verify(bookService, never()).salvar(any(Book.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao emprestar livro já emprestado")
    void deveLancarExcecaoAoEmprestarLivroJaEmprestado() {
        // Arrange
        Long bookId = 1L;
        Long userId = 1L;

        when(bookService.buscarPorId(bookId)).thenReturn(livroDisponivel);
        when(userService.buscarPorId(userId)).thenReturn(usuario);
        when(loanRepository.findByBookIdAndReturnedFalse(bookId))
            .thenReturn(Optional.of(emprestimoAtivo));

        // Act & Assert
        IllegalStateException exception = assertThrows(
            IllegalStateException.class,
            () -> LoanService.emprestar(bookId, userId),
            "Deveria lançar IllegalStateException para livro já emprestado"
        );

        assertTrue(exception.getMessage().contains("já está emprestado"));

        verify(loanRepository, never()).save(any(Loan.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao emprestar com livro inexistente")
    void deveLancarExcecaoAoEmprestarComLivroInexistente() {
        // Arrange
        Long bookIdInexistente = 999L;
        Long userId = 1L;

        when(bookService.buscarPorId(bookIdInexistente))
            .thenThrow(new BookNotFoundException("Livro não encontrado com ID: 999"));

        // Act & Assert
        assertThrows(
            BookNotFoundException.class,
            () -> LoanService.emprestar(bookIdInexistente, userId)
        );

        verify(loanRepository, never()).save(any(Loan.class));
    }

    // ========================================
    // TESTES PARA MÉTODO: devolver()
    // ========================================

    @Test
    @DisplayName("Deve registrar devolução com sucesso")
    void deveRegistrarDevolucaoComSucesso() {
        // Arrange
        Long loanId = 1L;
        int quantidadeAntes = livroDisponivel.getQuantidadeDisponivel();

        when(loanRepository.findById(loanId)).thenReturn(Optional.of(emprestimoAtivo));
        when(bookService.salvar(any(Book.class))).thenReturn(livroDisponivel);
        when(loanRepository.save(any(Loan.class))).thenReturn(emprestimoAtivo);

        // Act
        Loan resultado = LoanService.devolver(loanId);

        // Assert
        assertNotNull(resultado);
        assertTrue(resultado.isReturned(), "Empréstimo deve estar marcado como devolvido");
        assertEquals(LocalDate.now(), resultado.getReturnDate());

        // Verificar que o estoque foi incrementado
        verify(bookService, times(1)).salvar(any(Book.class));
        verify(loanRepository, times(1)).save(any(Loan.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao devolver empréstimo já devolvido")
    void deveLancarExcecaoAoDevolverEmprestimoJaDevolvido() {
        // Arrange
        Long loanId = 1L;
        emprestimoAtivo.setReturned(true);
        emprestimoAtivo.setReturnDate(LocalDate.now().minusDays(5));

        when(loanRepository.findById(loanId)).thenReturn(Optional.of(emprestimoAtivo));

        // Act & Assert
        IllegalStateException exception = assertThrows(
            IllegalStateException.class,
            () -> LoanService.devolver(loanId),
            "Deveria lançar IllegalStateException para empréstimo já devolvido"
        );

        assertTrue(exception.getMessage().contains("já foi devolvido"));

        // Verificar que NÃO salvou novamente
        verify(loanRepository, never()).save(any(Loan.class));
        verify(bookService, never()).salvar(any(Book.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao devolver empréstimo inexistente")
    void deveLancarExcecaoAoDevolverEmprestimoInexistente() {
        // Arrange
        Long loanIdInexistente = 999L;

        when(loanRepository.findById(loanIdInexistente)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(
            BookNotFoundException.class,
            () -> LoanService.devolver(loanIdInexistente)
        );

        verify(loanRepository, never()).save(any(Loan.class));
    }

    // ========================================
    // TESTES PARA MÉTODO: atualizar()
    // ========================================

    @Test
    @DisplayName("Deve atualizar empréstimo alterando apenas o usuário")
    void deveAtualizarEmprestimoAlterandoUsuario() {
        // Arrange
        Long loanId = 1L;
        Long novoBookId = 1L; // Mesmo livro
        Long novoUserId = 2L; // Usuário diferente

        User novoUsuario = new User();
        novoUsuario.setId(2L);
        novoUsuario.setNome("Carlos Oliveira");
        novoUsuario.setEmail("carlos@teste.com");

        when(loanRepository.findById(loanId)).thenReturn(Optional.of(emprestimoAtivo));
        when(bookService.buscarPorId(novoBookId)).thenReturn(livroDisponivel);
        when(userService.buscarPorId(novoUserId)).thenReturn(novoUsuario);
        when(loanRepository.save(any(Loan.class))).thenReturn(emprestimoAtivo);

        // Act
        Loan resultado = LoanService.atualizar(loanId, novoBookId, novoUserId);

        // Assert
        assertNotNull(resultado);
        assertEquals(novoUsuario, resultado.getUser());
        assertEquals(livroDisponivel, resultado.getBook());

        verify(loanRepository, times(1)).save(any(Loan.class));
        // Como o livro não mudou, não deve alterar estoque
        verify(bookService, never()).salvar(any(Book.class));
    }

    @Test
    @DisplayName("Deve atualizar empréstimo trocando o livro")
    void deveAtualizarEmprestimoTrocandoLivro() {
        // Arrange
        Long loanId = 1L;
        Long novoBookId = 3L; // Livro diferente
        Long novoUserId = 1L; // Mesmo usuário

        Book novoLivro = new Book();
        novoLivro.setId(3L);
        novoLivro.setTitulo("Novo Livro");
        novoLivro.setQuantidadeTotal(10);
        novoLivro.setQuantidadeDisponivel(5);

        when(loanRepository.findById(loanId)).thenReturn(Optional.of(emprestimoAtivo));
        when(bookService.buscarPorId(novoBookId)).thenReturn(novoLivro);
        when(userService.buscarPorId(novoUserId)).thenReturn(usuario);
        when(bookService.salvar(any(Book.class))).thenReturn(livroDisponivel);
        when(loanRepository.save(any(Loan.class))).thenReturn(emprestimoAtivo);

        // Act
        Loan resultado = LoanService.atualizar(loanId, novoBookId, novoUserId);

        // Assert
        assertNotNull(resultado);

        // Deve ter incrementado o livro antigo e decrementado o novo
        verify(bookService, times(2)).salvar(any(Book.class));
        verify(loanRepository, times(1)).save(any(Loan.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao atualizar empréstimo devolvido")
    void deveLancarExcecaoAoAtualizarEmprestimoDevolvido() {
        // Arrange
        Long loanId = 1L;
        emprestimoAtivo.setReturned(true);

        when(loanRepository.findById(loanId)).thenReturn(Optional.of(emprestimoAtivo));

        // Act & Assert
        IllegalStateException exception = assertThrows(
            IllegalStateException.class,
            () -> LoanService.atualizar(loanId, 1L, 1L),
            "Não deve permitir editar empréstimo devolvido"
        );

        assertTrue(exception.getMessage().contains("já foi devolvido"));

        verify(loanRepository, never()).save(any(Loan.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao trocar para livro sem estoque")
    void deveLancarExcecaoAoTrocarParaLivroSemEstoque() {
        // Arrange
        Long loanId = 1L;
        Long novoBookId = 2L; // Livro esgotado
        Long novoUserId = 1L;

        when(loanRepository.findById(loanId)).thenReturn(Optional.of(emprestimoAtivo));
        when(bookService.buscarPorId(novoBookId)).thenReturn(livroEsgotado);
        when(userService.buscarPorId(novoUserId)).thenReturn(usuario);

        // Act & Assert
        InsufficientStockException exception = assertThrows(
            InsufficientStockException.class,
            () -> LoanService.atualizar(loanId, novoBookId, novoUserId)
        );

        assertTrue(exception.getMessage().contains("Não há exemplares disponíveis"));

        // Deve ter liberado o livro antigo mas não salvou o novo empréstimo
        verify(bookService, times(1)).salvar(any(Book.class)); // Apenas libera o antigo
        verify(loanRepository, never()).save(any(Loan.class));
    }

    // ========================================
    // TESTES ADICIONAIS
    // ========================================

    @Test
    @DisplayName("Deve deletar empréstimo ativo e liberar o livro")
    void deveDeletarEmprestimoAtivoELiberarLivro() {
        // Arrange
        Long loanId = 1L;

        when(loanRepository.findById(loanId)).thenReturn(Optional.of(emprestimoAtivo));
        when(bookService.salvar(any(Book.class))).thenReturn(livroDisponivel);
        doNothing().when(loanRepository).delete(any(Loan.class));

        // Act
        LoanService.deletar(loanId);

        // Assert
        verify(bookService, times(1)).salvar(any(Book.class));
        verify(loanRepository, times(1)).delete(any(Loan.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao deletar empréstimo devolvido")
    void deveLancarExcecaoAoDeletarEmprestimoDevolvido() {
        // Arrange
        Long loanId = 1L;
        emprestimoAtivo.setReturned(true);

        when(loanRepository.findById(loanId)).thenReturn(Optional.of(emprestimoAtivo));

        // Act & Assert
        IllegalStateException exception = assertThrows(
            IllegalStateException.class,
            () -> LoanService.deletar(loanId)
        );

        assertTrue(exception.getMessage().contains("já foi devolvido"));

        verify(loanRepository, never()).delete(any(Loan.class));
    }
}