# Padrões de Codificação e Boas Práticas

A equipe definiu as seguintes 6 regras obrigatórias para garantir a qualidade e legibilidade do código (Clean Code):

1.  **Padrão de Nomenclatura (Naming):**

    - Classes em `PascalCase` (ex: `LivroController`).
    - Métodos e variáveis em `camelCase` (ex: `cadastrarLivro`, `nomeAutor`).
    - Constantes em `UPPER_CASE` (ex: `MAX_LIVROS`).

2.  **Nomes Significativos:**

    - Variáveis devem ter nomes que expliquem o seu conteúdo (ex: usar `dataDevolucao` em vez de `dt` ou `d1`).

3.  **Comentários de Código:**

    - Obrigatório uso de JavaDoc em classes e métodos públicos da API.
    - Evitar comentários óbvios (ex: `i++ // incrementa i`). O código deve ser autoexplicativo.

4.  **Princípio da Responsabilidade Única (SRP - SOLID):**

    - Cada classe deve ter apenas uma responsabilidade. (Ex: A classe `Livro` guarda dados, a classe `LivroController` gerencia as requisições).

5.  **Organização em Pacotes (MVC):**

    - O código deve estar separado logicamente em pacotes: `model` (entidades), `repository` (banco de dados), `controller` (API) e `service` (regras de negócio).

6.  **Tratamento de Exceções:**
    - Nunca deixar um bloco `try/catch` vazio. Erros devem ser tratados ou logados adequadamente.
