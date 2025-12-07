package vitual.libary.demo.controller;

import lombok.Data; // Importante para o DTO
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    // GET /api/loans - LISTAR TODOS
    @GetMapping
    public List<Loan> getAllLoans() {
        return loanService.listarTodos();
    }
    
    // GET /api/loans/{id} - BUSCAR UM
    @GetMapping("/{id}")
    public Loan getLoanById(@PathVariable Long id) {
        return loanService.buscarPorId(id);
    }

    // --- MUDANÇA: Classe auxiliar (DTO) para representar o JSON ---
    @Data
    public static class LoanRequestDTO {
        private Long bookId;
        private Long userId;
    }

    @Data
    public static class LoanUpdateRequestDTO {
        private Long bookId;
        private Long userId;
    }

    // CRIAÇÃO: Endpoint para EMPRESTAR um livro (Apenas BIBLIOTECARIO)
    // POST /api/loans/borrow
    // Body esperado: { "bookId": 10, "userId": 1 }
    @PostMapping("/borrow")
    @PreAuthorize("hasAuthority('BIBLIOTECARIO')")
    public ResponseEntity<Loan> borrowBook(@RequestBody LoanRequestDTO request) {
        // Extrai os IDs de dentro do objeto request (JSON)
        Loan newLoan = loanService.emprestar(request.getBookId(), request.getUserId());
        return new ResponseEntity<>(newLoan, HttpStatus.CREATED);
    }

    // DEVOLUÇÃO: Endpoint para DEVOLVER um livro (Apenas BIBLIOTECARIO)
    // PUT /api/loans/{loanId}/return - DEVE VIR ANTES DE PUT /{loanId} PARA EVITAR CONFLITO
    @PutMapping("/{loanId}/return")
    @PreAuthorize("hasAuthority('BIBLIOTECARIO')")
    public Loan returnBook(@PathVariable Long loanId) {
        return loanService.devolver(loanId);
    }

    // ATUALIZAÇÃO: Endpoint para EDITAR um empréstimo (Apenas BIBLIOTECARIO)
    // PUT /api/loans/{loanId}
    // Body esperado: { "bookId": 10, "userId": 2 }
    @PutMapping("/{loanId}")
    @PreAuthorize("hasAuthority('BIBLIOTECARIO')")
    public Loan updateLoan(@PathVariable Long loanId, @RequestBody LoanUpdateRequestDTO request) {
        return loanService.atualizar(loanId, request.getBookId(), request.getUserId());
    }

    // EXCLUSÃO: Endpoint para DELETAR um empréstimo (Apenas BIBLIOTECARIO)
    // DELETE /api/loans/{loanId}
    @DeleteMapping("/{loanId}")
    @PreAuthorize("hasAuthority('BIBLIOTECARIO')")
    public ResponseEntity<Void> deleteLoan(@PathVariable Long loanId) {
        loanService.deletar(loanId);
        return ResponseEntity.noContent().build();
    }
}