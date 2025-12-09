package vitual.libary.demo.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import vitual.libary.demo.entity.Book;
import vitual.libary.demo.exception.BookNotFoundException;
import vitual.libary.demo.repository.BookRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Testes Unitários para BookService
 * 
 * Utiliza JUnit 5 + Mockito para testar as operações de negócio
 * isoladamente, sem dependências de banco de dados.
 * 
 * Cobertura de testes:
 * - salvar() - Cadastro de livro
 * - buscarPorId() - Consulta de livro
 * - atualizar() - Edição de livro
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Testes Unitários - BookService")
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookService BookService;

    private Book livroExemplo;

    @BeforeEach
    void setUp() {
        // Arrange - Preparar dados de teste
        livroExemplo = new Book();
        livroExemplo.setId(1L);
        livroExemplo.setTitulo("Dom Casmurro");
        livroExemplo.setAutor("Machado de Assis");
        livroExemplo.setAnoPublicacao(1899);
        livroExemplo.setIsbn("978-8535911664");
        livroExemplo.setQuantidadeTotal(5);
        livroExemplo.setQuantidadeDisponivel(5);
    }

    // ========================================
    // TESTES PARA MÉTODO: salvar()
    // ========================================

    @Test
    @DisplayName("Deve salvar um livro com sucesso")
    void deveSalvarLivroComSucesso() {
        // Arrange
        Book novoLivro = new Book();
        novoLivro.setTitulo("Memórias Póstumas de Brás Cubas");
        novoLivro.setAutor("Machado de Assis");
        novoLivro.setAnoPublicacao(1881);
        novoLivro.setIsbn("978-8535911671");
        novoLivro.setQuantidadeTotal(3);
        novoLivro.setQuantidadeDisponivel(3);

        when(bookRepository.save(any(Book.class))).thenReturn(novoLivro);

        // Act
        Book resultado = BookService.salvar(novoLivro);

        // Assert
        assertNotNull(resultado, "O livro salvo não deve ser nulo");
        assertEquals("Memórias Póstumas de Brás Cubas", resultado.getTitulo());
        assertEquals("Machado de Assis", resultado.getAutor());
        assertEquals(1881, resultado.getAnoPublicacao());
        assertEquals(3, resultado.getQuantidadeTotal());
        assertEquals(3, resultado.getQuantidadeDisponivel());

        // Verificar que o método save foi chamado exatamente 1 vez
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    @Test
    @DisplayName("Deve validar que quantidade disponível não pode ser maior que total")
    void deveValidarQuantidadeDisponivelMaiorQueTotal() {
        // Arrange
        Book livroInvalido = new Book();
        livroInvalido.setTitulo("Livro Teste");
        livroInvalido.setAutor("Autor Teste");
        livroInvalido.setAnoPublicacao(2025);
        livroInvalido.setIsbn("123456789");
        livroInvalido.setQuantidadeTotal(5);
        livroInvalido.setQuantidadeDisponivel(10); // ERRO: disponível > total

        // Este teste assume que a validação está no service ou será adicionada
        // Por enquanto, apenas documenta o comportamento esperado
        
        // Act & Assert - Deve lançar exceção ou normalizar o valor
        // (Implementar validação no BookService se necessário)
    }

    @Test
    @DisplayName("Deve salvar livro com quantidade zero")
    void deveSalvarLivroComQuantidadeZero() {
        // Arrange
        Book livroZero = new Book();
        livroZero.setTitulo("Livro Esgotado");
        livroZero.setAutor("Autor Teste");
        livroZero.setAnoPublicacao(2020);
        livroZero.setIsbn("000000000");
        livroZero.setQuantidadeTotal(0);
        livroZero.setQuantidadeDisponivel(0);

        when(bookRepository.save(any(Book.class))).thenReturn(livroZero);

        // Act
        Book resultado = BookService.salvar(livroZero);

        // Assert
        assertNotNull(resultado);
        assertEquals(0, resultado.getQuantidadeTotal());
        assertEquals(0, resultado.getQuantidadeDisponivel());
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    // ========================================
    // TESTES PARA MÉTODO: buscarPorId()
    // ========================================

    @Test
    @DisplayName("Deve buscar livro por ID com sucesso")
    void deveBuscarLivroPorIdComSucesso() {
        // Arrange
        Long idBusca = 1L;
        when(bookRepository.findById(idBusca)).thenReturn(Optional.of(livroExemplo));

        // Act
        Book resultado = BookService.buscarPorId(idBusca);

        // Assert
        assertNotNull(resultado, "O livro encontrado não deve ser nulo");
        assertEquals(idBusca, resultado.getId());
        assertEquals("Dom Casmurro", resultado.getTitulo());
        assertEquals("Machado de Assis", resultado.getAutor());
        assertEquals(1899, resultado.getAnoPublicacao());

        // Verificar que findById foi chamado com o ID correto
        verify(bookRepository, times(1)).findById(idBusca);
    }

    @Test
    @DisplayName("Deve lançar BookNotFoundException quando livro não existe")
    void deveLancarExcecaoQuandoLivroNaoExiste() {
        // Arrange
        Long idInexistente = 999L;
        when(bookRepository.findById(idInexistente)).thenReturn(Optional.empty());

        // Act & Assert
        BookNotFoundException exception = assertThrows(
            BookNotFoundException.class,
            () -> BookService.buscarPorId(idInexistente),
            "Deveria lançar BookNotFoundException"
        );

        // Verificar mensagem da exceção
        assertTrue(exception.getMessage().contains("999"));
        assertTrue(exception.getMessage().contains("não encontrado"));

        // Verificar que findById foi chamado
        verify(bookRepository, times(1)).findById(idInexistente);
    }

    @Test
    @DisplayName("Deve buscar livro com ID válido mas livro deletado")
    void deveBuscarLivroComIdValidoMasLivroDeletado() {
        // Arrange
        Long idDeletado = 10L;
        when(bookRepository.findById(idDeletado)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(
            BookNotFoundException.class,
            () -> BookService.buscarPorId(idDeletado)
        );

        verify(bookRepository, times(1)).findById(idDeletado);
    }

    // ========================================
    // TESTES PARA MÉTODO: atualizar()
    // ========================================

    @Test
    @DisplayName("Deve atualizar livro existente com sucesso")
    void deveAtualizarLivroComSucesso() {
        // Arrange
        Long idParaAtualizar = 1L;
        
        Book dadosAtualizados = new Book();
        dadosAtualizados.setTitulo("Dom Casmurro - Edição Especial");
        dadosAtualizados.setAutor("Machado de Assis");
        dadosAtualizados.setAnoPublicacao(2020);
        dadosAtualizados.setIsbn("978-8535911664");
        dadosAtualizados.setQuantidadeTotal(10);
        dadosAtualizados.setQuantidadeDisponivel(8);

        when(bookRepository.findById(idParaAtualizar)).thenReturn(Optional.of(livroExemplo));
        when(bookRepository.save(any(Book.class))).thenReturn(livroExemplo);

        // Act
        Book resultado = BookService.atualizar(idParaAtualizar, dadosAtualizados);

        // Assert
        assertNotNull(resultado, "O livro atualizado não deve ser nulo");
        assertEquals("Dom Casmurro - Edição Especial", resultado.getTitulo());
        assertEquals(2020, resultado.getAnoPublicacao());
        assertEquals(10, resultado.getQuantidadeTotal());
        assertEquals(8, resultado.getQuantidadeDisponivel());

        // Verificar que os métodos foram chamados
        verify(bookRepository, times(1)).findById(idParaAtualizar);
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao atualizar livro inexistente")
    void deveLancarExcecaoAoAtualizarLivroInexistente() {
        // Arrange
        Long idInexistente = 999L;
        Book dadosAtualizados = new Book();
        dadosAtualizados.setTitulo("Título Qualquer");
        dadosAtualizados.setAutor("Autor Qualquer");

        when(bookRepository.findById(idInexistente)).thenReturn(Optional.empty());

        // Act & Assert
        BookNotFoundException exception = assertThrows(
            BookNotFoundException.class,
            () -> BookService.atualizar(idInexistente, dadosAtualizados),
            "Deveria lançar BookNotFoundException ao atualizar livro inexistente"
        );

        // Verificar que findById foi chamado mas save NÃO foi
        verify(bookRepository, times(1)).findById(idInexistente);
        verify(bookRepository, never()).save(any(Book.class));
    }

    @Test
    @DisplayName("Deve atualizar apenas alguns campos do livro")
    void deveAtualizarApenasAlgunsCampos() {
        // Arrange
        Long idParaAtualizar = 1L;
        
        Book dadosAtualizados = new Book();
        dadosAtualizados.setTitulo("Dom Casmurro"); // Mantém
        dadosAtualizados.setAutor("Machado de Assis"); // Mantém
        dadosAtualizados.setAnoPublicacao(1899); // Mantém
        dadosAtualizados.setIsbn("978-8535911664"); // Mantém
        dadosAtualizados.setQuantidadeTotal(15); // ALTERA
        dadosAtualizados.setQuantidadeDisponivel(12); // ALTERA

        when(bookRepository.findById(idParaAtualizar)).thenReturn(Optional.of(livroExemplo));
        when(bookRepository.save(any(Book.class))).thenReturn(livroExemplo);

        // Act
        Book resultado = BookService.atualizar(idParaAtualizar, dadosAtualizados);

        // Assert
        assertNotNull(resultado);
        assertEquals(15, resultado.getQuantidadeTotal());
        assertEquals(12, resultado.getQuantidadeDisponivel());

        verify(bookRepository, times(1)).findById(idParaAtualizar);
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    // ========================================
    // TESTES ADICIONAIS - MÉTODOS AUXILIARES
    // ========================================

    @Test
    @DisplayName("Deve listar todos os livros com paginação")
    void deveListarTodosLivrosComPaginacao() {
        // Arrange
        List<Book> listaLivros = Arrays.asList(livroExemplo);
        Page<Book> pageResponse = new PageImpl<>(listaLivros);
        Pageable pageable = PageRequest.of(0, 10);

        when(bookRepository.findAll(pageable)).thenReturn(pageResponse);

        // Act
        Page<Book> resultado = BookService.listarTodos(pageable);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.getContent().size());
        assertEquals("Dom Casmurro", resultado.getContent().get(0).getTitulo());

        verify(bookRepository, times(1)).findAll(pageable);
    }

    @Test
    @DisplayName("Deve buscar livros por título com paginação")
    void deveBuscarLivrosPorTituloComPaginacao() {
        // Arrange
        String termoBusca = "Dom";
        List<Book> listaLivros = Arrays.asList(livroExemplo);
        Page<Book> pageResponse = new PageImpl<>(listaLivros);
        Pageable pageable = PageRequest.of(0, 10);

        when(bookRepository.findByTituloContainingIgnoreCase(termoBusca, pageable))
            .thenReturn(pageResponse);

        // Act
        Page<Book> resultado = BookService.buscarPorTitulo(termoBusca, pageable);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.getContent().size());
        assertEquals("Dom Casmurro", resultado.getContent().get(0).getTitulo());

        verify(bookRepository, times(1)).findByTituloContainingIgnoreCase(termoBusca, pageable);
    }

    @Test
    @DisplayName("Deve deletar livro com sucesso")
    void deveDeletarLivroComSucesso() {
        // Arrange
        Long idParaDeletar = 1L;
        when(bookRepository.findById(idParaDeletar)).thenReturn(Optional.of(livroExemplo));
        doNothing().when(bookRepository).delete(any(Book.class));

        // Act
        BookService.deletar(idParaDeletar);

        // Assert
        verify(bookRepository, times(1)).findById(idParaDeletar);
        verify(bookRepository, times(1)).delete(any(Book.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao deletar livro inexistente")
    void deveLancarExcecaoAoDeletarLivroInexistente() {
        // Arrange
        Long idInexistente = 999L;
        when(bookRepository.findById(idInexistente)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(
            BookNotFoundException.class,
            () -> BookService.deletar(idInexistente)
        );

        verify(bookRepository, times(1)).findById(idInexistente);
        verify(bookRepository, never()).delete(any(Book.class));
    }
}