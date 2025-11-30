package vitual.libary.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vitual.libary.demo.entity.Book;
import vitual.libary.demo.entity.Loan;
import vitual.libary.demo.entity.User;
import vitual.libary.demo.exception.BookNotFoundException;
import vitual.libary.demo.exception.InsufficientStockException;
import vitual.libary.demo.repository.LoanRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final BookService bookService;
    private final UserService userService;

    public LoanService(LoanRepository loanRepository, BookService bookService, UserService userService) {
        this.loanRepository = loanRepository;
        this.bookService = bookService;
        this.userService = userService;
    }

    public List<Loan> listarTodos() {
        return loanRepository.findAll();
    }
    
    public Loan buscarPorId(Long id) {
        return loanRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Empréstimo não encontrado com ID: " + id));
    }

    /**
     * Realiza o empréstimo de um livro para um usuário.
     * Valida se há exemplares disponíveis e decrementa o estoque.
     * 
     * @param bookId ID do livro
     * @param userId ID do usuário
     * @return Empréstimo criado
     * @throws InsufficientStockException se não há exemplares disponíveis
     */
    @Transactional
    public Loan emprestar(Long bookId, Long userId) {
        // 1. Busca as entidades
        Book book = bookService.buscarPorId(bookId);
        User user = userService.buscarPorId(userId);

        // 2. Validação: Verifica se há exemplares disponíveis
        if (book.getQuantidadeDisponivel() <= 0) {
            throw new InsufficientStockException(
                    "Não há exemplares disponíveis do livro '" + book.getTitulo() + "'.");
        }

        // 3. Lógica de Negócio: Verifica se o livro já está emprestado para este usuário
        loanRepository.findByBookIdAndReturnedFalse(bookId)
                .ifPresent(loan -> {
                    throw new IllegalStateException(
                            "Livro com ID: " + bookId + " já está emprestado.");
                });

        // 4. Decrementa o estoque
        book.setQuantidadeDisponivel(book.getQuantidadeDisponivel() - 1);
        bookService.salvar(book);

        // 5. Cria e Salva o novo Empréstimo
        Loan newLoan = new Loan();
        newLoan.setBook(book);
        newLoan.setUser(user);
        newLoan.setLoanDate(LocalDate.now());
        newLoan.setReturned(false);

        return loanRepository.save(newLoan);
    }

    /**
     * Marca um empréstimo como devolvido.
     * Incrementa a quantidade disponível do livro.
     * 
     * @param loanId ID do empréstimo
     * @return Empréstimo marcado como devolvido
     */
    @Transactional
    public Loan devolver(Long loanId) {
        Loan loan = buscarPorId(loanId);

        if (loan.isReturned()) {
            throw new IllegalStateException(
                    "O empréstimo com ID: " + loanId + " já foi devolvido.");
        }

        // Incrementa a quantidade disponível
        Book book = loan.getBook();
        book.setQuantidadeDisponivel(book.getQuantidadeDisponivel() + 1);
        bookService.salvar(book);

        // Marca como devolvido
        loan.setReturned(true);
        loan.setReturnDate(LocalDate.now());

        return loanRepository.save(loan);
    }
}