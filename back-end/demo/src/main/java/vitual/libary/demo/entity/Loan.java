package vitual.libary.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "loans")
@Data
@NoArgsConstructor
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relacionamento Many-to-One: Muitos empréstimos para um único usuário
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Relacionamento Many-to-One: Muitos empréstimos podem ser feitos para um único livro
    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(nullable = false)
    private LocalDate loanDate = LocalDate.now(); // Data do empréstimo

    private LocalDate returnDate; // Data de devolução

    private boolean returned = false;
}