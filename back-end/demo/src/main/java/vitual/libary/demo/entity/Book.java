package vitual.libary.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Data; 
import lombok.NoArgsConstructor;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O título é obrigatório.")
    private String titulo;

    @NotBlank(message = "O autor é obrigatório.")
    private String autor;

    @NotNull(message = "O ano de publicação é obrigatório.")
    private Integer anoPublicacao;

    @NotBlank(message = "O ISBN é obrigatório.")
    private String isbn;

    @NotNull(message = "A quantidade total é obrigatória.")
    @Min(value = 0, message = "A quantidade total não pode ser negativa.")
    @Column(nullable = false)
    private Integer quantidadeTotal = 0;

    @NotNull(message = "A quantidade disponível é obrigatória.")
    @Min(value = 0, message = "A quantidade disponível não pode ser negativa.")
    @Column(nullable = false)
    private Integer quantidadeDisponivel = 0;
}