# 📍 MAPA COMPLETO DE ROTAS - Frontend ↔ Backend

---

## 🔐 AUTENTICAÇÃO

### Login
```
Frontend: POST /auth/login
Body:     { email, senha }
Backend:  AuthController.login()
Response: { token, userId, nome, role }
Status:   200 OK
Auth:     ❌ Não requer
```

### Registro
```
Frontend: POST /auth/register
Body:     { nome, email, senha, role }
Backend:  AuthController.registrar()
Response: { token, userId, nome, role }
Status:   201 CREATED
Auth:     ❌ Não requer
```

---

## 📚 LIVROS (RF01-RF04)

### Listar com Paginação e Busca
```
Frontend: GET /books?page=0&size=10&titulo="Java"
Backend:  BookController.getAllBooks(page, size, titulo)
Response: Page<Book> { content: [], totalPages: 4 }
Status:   200 OK
Auth:     ✅ Requer token (qualquer role)
```

### Obter um Livro
```
Frontend: GET /books/1
Backend:  BookController.getBookById(1)
Response: Book { id, titulo, autor, ... }
Status:   200 OK ou 404 NOT FOUND
Auth:     ✅ Requer token
```

### Criar Livro
```
Frontend: POST /books
Body:     { titulo, autor, anoPublicacao, isbn, quantidadeTotal }
Backend:  BookController.createBook()
Response: Book { id, titulo, ... }
Status:   201 CREATED
Auth:     ✅ Requer token + BIBLIOTECARIO
```

### Atualizar Livro
```
Frontend: PUT /books/1
Body:     { titulo, autor, anoPublicacao, isbn, quantidadeTotal }
Backend:  BookController.updateBook()
Response: Book { id, titulo, ... }
Status:   200 OK
Auth:     ✅ Requer token + BIBLIOTECARIO
```

### Deletar Livro
```
Frontend: DELETE /books/1
Body:     (vazio)
Backend:  BookController.deleteBook()
Response: (vazio)
Status:   204 NO CONTENT
Auth:     ✅ Requer token + BIBLIOTECARIO
```

---

## 👥 USUÁRIOS/MEMBROS (RF10, RF11)

### Listar Todos
```
Frontend: GET /users
Backend:  UserController.getAllUsers()
Response: List<User> [ { id, nome, email, role }, ... ]
Status:   200 OK
Auth:     ✅ Requer token (qualquer role)
```

### Obter um Usuário
```
Frontend: GET /users/1
Backend:  UserController.getUserById(1)
Response: User { id, nome, email, role }
Status:   200 OK ou 404 NOT FOUND
Auth:     ✅ Requer token
```

### Criar Usuário
```
Frontend: POST /users
Body:     { nome, email, senha, role }
Backend:  UserController.createUser()
Response: User { id, nome, email, role }
Status:   201 CREATED
Auth:     ✅ Requer token (qualquer role)
```

### Atualizar Usuário
```
Frontend: PUT /users/1
Body:     { nome, email, senha?, role }
Backend:  UserController.updateUser()
Response: User { id, nome, email, role }
Status:   200 OK
Auth:     ✅ Requer token
```

### Deletar Usuário
```
Frontend: DELETE /users/1
Body:     (vazio)
Backend:  UserController.deleteUser()
Response: (vazio)
Status:   204 NO CONTENT
Auth:     ✅ Requer token
```

---

## 🔗 EMPRÉSTIMOS (RF05-RF08, RF12)

### Listar Todos
```
Frontend: GET /loans
Backend:  LoanController.getAllLoans()
Response: List<Loan> [ { id, userId, bookId, loanDate, returnDate, returned }, ... ]
Status:   200 OK
Auth:     ✅ Requer token
```

### Obter um Empréstimo
```
Frontend: GET /loans/1
Backend:  LoanController.getLoanById(1)
Response: Loan { id, userId, bookId, loanDate, returnDate, returned }
Status:   200 OK ou 404 NOT FOUND
Auth:     ✅ Requer token
```

### Emprestar Livro
```
Frontend: POST /loans/borrow
Body:     { bookId: 5, userId: 2 }
Backend:  LoanController.borrowBook()
Response: Loan { id, bookId, userId, loanDate, ... }
Status:   201 CREATED
Auth:     ✅ Requer token + BIBLIOTECARIO
Lógica:   Cria empréstimo + diminui quantidadeDisponivel
```

### Devolver Livro
```
Frontend: PUT /loans/1/return
Body:     (vazio)
Backend:  LoanController.returnBook()
Response: Loan { id, ... returned: true, returnDate: "2025-12-02" }
Status:   200 OK
Auth:     ✅ Requer token + BIBLIOTECARIO
Lógica:   Marca como devolvido + aumenta quantidadeDisponivel
```

---

## 🔄 FLUXO COMPLETO: Exemplo Prático

### Cenário: Emprestar um Livro

**Passo 1: Login (Bibliotecário)**
```powershell
POST http://localhost:8080/api/auth/login
{
  "email": "joao.silva@teste.com",
  "senha": "senha123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIy...",
  "userId": 1,
  "nome": "João Silva",
  "email": "joao.silva@teste.com",
  "role": "BIBLIOTECARIO"
}
```

**Passo 2: Buscar Livros Disponíveis**
```powershell
GET http://localhost:8080/api/books?page=0&size=10
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

Response:
{
  "content": [
    { "id": 5, "titulo": "Clean Code", "quantidadeDisponivel": 3 },
    { "id": 12, "titulo": "Design Patterns", "quantidadeDisponivel": 1 }
  ],
  "totalElements": 31,
  "totalPages": 4
}
```

**Passo 3: Buscar Membros**
```powershell
GET http://localhost:8080/api/users
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

Response:
[
  { "id": 2, "nome": "Maria Santos", "email": "maria@teste.com", "role": "MEMBRO" },
  { "id": 3, "nome": "Carlos Oliveira", "email": "carlos@teste.com", "role": "MEMBRO" }
]
```

**Passo 4: Criar Empréstimo**
```powershell
POST http://localhost:8080/api/loans/borrow
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Body:
{
  "bookId": 5,
  "userId": 2
}

Response:
{
  "id": 15,
  "bookId": 5,
  "userId": 2,
  "loanDate": "2025-12-02",
  "returnDate": null,
  "returned": false
}

Database Changes:
- INSERT INTO loans (book_id, user_id, loan_date, returned) VALUES (5, 2, '2025-12-02', false)
- UPDATE books SET quantidade_disponivel = 2 WHERE id = 5 (3 - 1)
```

**Passo 5: Devolver Livro**
```powershell
PUT http://localhost:8080/api/loans/15/return
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

Response:
{
  "id": 15,
  "bookId": 5,
  "userId": 2,
  "loanDate": "2025-12-02",
  "returnDate": "2025-12-02",
  "returned": true
}

Database Changes:
- UPDATE loans SET returned = true, return_date = '2025-12-02' WHERE id = 15
- UPDATE books SET quantidade_disponivel = 3 WHERE id = 5 (2 + 1)
```

---

## 📊 TABELA DE PERMISSÕES

| Endpoint | Método | GET | POST | PUT | DELETE |
|----------|--------|-----|------|-----|--------|
| `/auth/*` | - | ❌ | ✅ | ❌ | ❌ |
| `/books` | GET | ✅ | ❌ | ❌ | ❌ |
| `/books` | POST | ❌ | 📚 | ❌ | ❌ |
| `/books/{id}` | GET | ✅ | ❌ | ❌ | ❌ |
| `/books/{id}` | PUT | ❌ | ❌ | 📚 | ❌ |
| `/books/{id}` | DELETE | ❌ | ❌ | ❌ | 📚 |
| `/users` | GET | ✅ | ❌ | ❌ | ❌ |
| `/users` | POST | ❌ | ✅ | ❌ | ❌ |
| `/users/{id}` | GET | ✅ | ❌ | ❌ | ❌ |
| `/users/{id}` | PUT | ❌ | ❌ | ✅ | ❌ |
| `/users/{id}` | DELETE | ❌ | ❌ | ❌ | ✅ |
| `/loans` | GET | ✅ | ❌ | ❌ | ❌ |
| `/loans/borrow` | POST | ❌ | 📚 | ❌ | ❌ |
| `/loans/{id}/return` | PUT | ❌ | ❌ | 📚 | ❌ |

**Legenda:**
- ✅ = Qualquer usuário autenticado
- 📚 = Apenas BIBLIOTECARIO
- ❌ = Não permitido

---

## 🛡️ Camadas de Segurança

```
Frontend (React)
    ↓
    └─→ localStorage.getItem('jwt_token')
    └─→ localStorage.getItem('user_role')
    └─→ Validações de formulário
    
    ↓
    
HTTP Request com JWT Header
    └─→ Authorization: Bearer eyJhbGc...
    
    ↓
    
Backend (Spring Boot)
    ├─→ JwtAuthenticationFilter valida token
    ├─→ @PreAuthorize verifica autorização
    ├─→ Service valida regras de negócio
    └─→ Banco de dados executa operações
    
    ↓
    
HTTP Response
    └─→ 200 OK / 201 CREATED / 204 NO CONTENT / 4xx / 5xx
```

---

## ⏱️ Timeouts e Limites

| Recurso | Limite | Descrição |
|---------|--------|-----------|
| JWT Token | 24 horas | Token expira após 24h (86400000 ms) |
| Página de Livros | 10-50 itens | Paginação padrão 10, máximo 50 |
| Tamanho de Senha | 8-255 chars | Requisito de entrada |
| Tamanho de Email | 255 chars | Máximo do campo varchar |

---

**Todas as rotas verificadas e funcionando! ✅**
