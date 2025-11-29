package vitual.libary.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vitual.libary.demo.entity.Loan;
import vitual.libary.demo.service.LoanService;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    // GET /api/loans - READ ALL
    @GetMapping
    public List<Loan> getAllLoans() {
        return loanService.listarTodos();
    }
    
    // GET /api/loans/{id} - READ ONE
    @GetMapping("/{id}")
    public Loan getLoanById(@PathVariable Long id) {
        return loanService.buscarPorId(id); // Status 200 ou 404
    }

    // CRIAÇÃO: Endpoint para EMPRESTAR um livro
    // POST /api/loans/borrow?bookId=1&userId=1
    @PostMapping("/borrow")
    public ResponseEntity<Loan> borrowBook(@RequestParam Long bookId, @RequestParam Long userId) {
        Loan newLoan = loanService.emprestar(bookId, userId);
        return new ResponseEntity<>(newLoan, HttpStatus.CREATED); // Status 201
    }

    // ATUALIZAÇÃO: Endpoint para DEVOLVER um livro
    // PUT /api/loans/{loanId}/return
    @PutMapping("/{loanId}/return")
    public Loan returnBook(@PathVariable Long loanId) {
        return loanService.devolver(loanId); // Status 200 ou 404
    }
}