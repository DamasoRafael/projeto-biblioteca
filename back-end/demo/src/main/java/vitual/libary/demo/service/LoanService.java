package vitual.libary.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vitual.libary.demo.entity.Book;
import vitual.libary.demo.entity.Loan;
import vitual.libary.demo.entity.User;
import vitual.libary.demo.exception.BookNotFoundException;
import vitual.libary.demo.repository.LoanRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final BookService bookService; // Reutiliza o serviço de livro
    private final UserService userService; // Reutiliza o serviço de usuário

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

    // CRIAÇÃO: Opera o empréstimo de um Livro para um Usuário
    @Transactional
    public Loan emprestar(Long bookId, Long userId) {
        // 1. Busca as entidades (lança 404 se não existirem)
        Book book = bookService.buscarPorId(bookId);
        User user = userService.buscarPorId(userId);

        // 2. Lógica de Negócio: Verificar se o livro já está emprestado
        loanRepository.findByBookIdAndReturnedFalse(bookId)
                .ifPresent(loan -> {
                    throw new IllegalStateException("Livro com ID: " + bookId + " já está emprestado.");
                });

        // 3. Cria e Salva o novo Empréstimo
        Loan newLoan = new Loan();
        newLoan.setBook(book);
        newLoan.setUser(user);
        newLoan.setLoanDate(LocalDate.now());

        return loanRepository.save(newLoan);
    }

    // ATUALIZAÇÃO: Marca um empréstimo como devolvido
    @Transactional
    public Loan devolver(Long loanId) {
        Loan loan = buscarPorId(loanId);

        if (loan.isReturned()) {
            throw new IllegalStateException("O empréstimo com ID: " + loanId + " já foi devolvido.");
        }

        loan.setReturned(true);
        loan.setReturnDate(LocalDate.now());

        return loanRepository.save(loan);
    }
}