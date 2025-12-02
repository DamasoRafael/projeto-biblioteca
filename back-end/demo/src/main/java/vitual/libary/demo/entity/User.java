package vitual.libary.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome é obrigatório.")
    private String nome;

    @NotBlank(message = "O email é obrigatório.")
    @Email(message = "Email inválido.")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "A senha é obrigatória.")
    private String senha;

    @Column(name = "role", nullable = false)
    private String role = "MEMBRO"; // MEMBRO ou BIBLIOTECARIO

    // Relacionamento Opcional: Um usuário pode ter vários empréstimos
    // Não é estritamente necessário para esta fase, mas é bom para consistência
    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    // private List<Loan> loans;
}