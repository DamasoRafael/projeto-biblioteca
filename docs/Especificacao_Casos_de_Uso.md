# Especificação dos Casos de Uso

Este documento detalha os principais Casos de Uso do sistema, conforme a Tarefa #11 da Sprint 1, baseados no Diagrama de Casos de Uso (Tarefa #10).

---

## UC-01: Fazer Login

- **Nome:** Fazer Login
- **Atores:** Bibliotecário, Membro
- **Descrição:** Permite que um usuário autenticado (Bibliotecário ou Membro) acesse as áreas restritas do sistema.
- **Pré-condições:**
  1.  O usuário deve possuir um cadastro prévio no sistema.
- **Pós-condições:**
  1.  O sistema concede ao usuário um token de acesso.
  2.  O usuário é redirecionado para sua página inicial (dashboard).
- **Fluxo Principal (Caminho Feliz):**
  1.  O usuário acessa a página de login.
  2.  O usuário informa seu e-mail e senha.
  3.  O usuário clica em "Entrar".
  4.  O sistema valida as credenciais.
  5.  O sistema identifica o perfil do usuário (Bibliotecário ou Membro).
  6.  O sistema gera um token de autenticação e o armazena no front-end.
  7.  O sistema redireciona o usuário para a página correspondente ao seu perfil.
- **Fluxos Alternativos (Exceções):**
  - **FA-01: Credenciais inválidas:** No passo 4, se o e-mail ou a senha estiverem incorretos, o sistema exibe a mensagem "Usuário ou senha inválidos" e permanece na página de login.

---

## UC-02: Gerenciar Livros (CRUD Simples)

- **Nome:** Gerenciar Livros
- **Atores:** Bibliotecário
- **Descrição:** Cobre o ciclo de vida (CRUD) de um Livro no acervo (RF03, RF04, RF05, RF06).
- **Pré-condições:**
  1.  O Bibliotecário deve estar autenticado no sistema.
- **Fluxo Principal (Cadastro):**
  1.  O Bibliotecário acessa a área "Manter Acervo" e clica em "Novo Livro".
  2.  O sistema exibe um formulário com os campos: título, autor, ISBN, ano, etc.
  3.  O Bibliotecário preenche os dados e clica em "Salvar".
  4.  O sistema valida os dados e salva o novo livro no banco de dados.
  5.  O sistema exibe uma mensagem de sucesso.
- **Fluxo Principal (Consulta):**
  1.  O Bibliotecário (ou Membro, ou visitante) acessa a área "Consultar Acervo".
  2.  O usuário digita um termo no campo de busca (título ou autor).
  3.  O sistema retorna uma lista de livros que correspondem à busca.
- _(Fluxos de Alteração e Exclusão são similares)_
- **Fluxos Alternativos (Exceções):**
  - **FA-01: Dados inválidos:** No passo 4 (Cadastro), se um campo obrigatório (ex: título) estiver vazio, o sistema exibe uma mensagem de erro no formulário e não salva.

---

## UC-03: Realizar Empréstimo (CRUD Complexo)

- **Nome:** Realizar Empréstimo
- **Atores:** Bibliotecário
- **Descrição:** Permite ao Bibliotecário registrar a saída de um livro para um membro (RF10).
- **Pré-condições:**
  1.  O Bibliotecário deve estar autenticado.
  2.  O Membro deve estar cadastrado.
  3.  O Livro deve estar cadastrado e disponível.
- **Pós-condições:**
  1.  Um novo registro de `Emprestimo` é criado.
  2.  O status do `Livro` é atualizado para "Emprestado".
- **Fluxo Principal (Caminho Feliz):**
  1.  O Bibliotecário inicia o caso de uso (clica em "Novo Empréstimo").
  2.  O sistema solicita a identificação do Membro (ex: CPF ou ID).
  3.  O Bibliotecário informa o Membro.
  4.  O sistema valida o Membro e confirma que ele não tem pendências (RF11).
  5.  O sistema solicita a identificação do Livro (ex: ISBN ou ID).
  6.  O Bibliotecário informa o Livro.
  7.  O sistema valida o Livro e confirma que ele está "Disponível" (RF11).
  8.  O Bibliotecário confirma a operação.
  9.  O sistema salva o Empréstimo (associando `Membro`, `Livro` e `data_emprestimo`) e atualiza o status do Livro.
  10. O sistema exibe uma mensagem de sucesso.
- **Fluxos Alternativos (Exceções):**
  - **FA-01: Membro com pendências:** No passo 4, se o Membro tiver atrasos, o sistema exibe uma mensagem de erro ("Membro com pendências") e o caso de uso é encerrado.
  - **FA-02: Livro indisponível:** No passo 7, se o Livro estiver "Emprestado", o sistema exibe uma mensagem de erro ("Livro indisponível") e o fluxo retorna ao passo 5.

---

## UC-04: Registrar Devolução

- **Nome:** Registrar Devolução
- **Atores:** Bibliotecário
- **Descrição:** Permite ao Bibliotecário registrar a devolução de um livro (RF12).
- **Pré-condições:**
  1.  O Bibliotecário deve estar autenticado.
  2.  Deve existir um registro de empréstimo ativo para o livro.
- **Pós-condições:**
  1.  O registro de `Emprestimo` é atualizado (ex: com a data de devolução).
  2.  O status do `Livro` é atualizado para "Disponível".
- **Fluxo Principal (Caminho Feliz):**
  1.  O Bibliotecário inicia o caso de uso (clica em "Registrar Devolução").
  2.  O sistema solicita a identificação do Livro (ex: ISBN ou ID).
  3.  O Bibliotecário informa o Livro.
  4.  O sistema busca o empréstimo ativo para aquele livro.
  5.  O Bibliotecário confirma a devolução.
  6.  O sistema salva a data de devolução no registro de `Emprestimo` e atualiza o status do `Livro` para "Disponível".
  7.  O sistema exibe uma mensagem de sucesso.
- **Fluxos Alternativos (Exceções):**
  - **FA-01: Devolução com atraso:** No passo 6, se a data de devolução for posterior à data prevista, o sistema deve registrar a multa (se houver) antes de finalizar a devolução.
