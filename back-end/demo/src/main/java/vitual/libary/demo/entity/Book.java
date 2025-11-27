package vitual.libary.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data; // Adicione o import do Lombok
import lombok.NoArgsConstructor; // Adicione o import do Lombok

@Entity
@Table(name = "books")
@Data // Adiciona getters, setters, toString, equals, hashCode (via Lombok)
@NoArgsConstructor // Adiciona construtor sem argumentos (via Lombok)
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
    
}