# 📚 Sistema de Biblioteca - Aplicação Web Full Stack

## 📋 Contexto do Problema e Solução

Bibliotecas locais e acadêmicas frequentemente dependem de processos manuais, como fichas de papel, ou sistemas legados para o gerenciamento de seu acervo e empréstimos. Isso resulta em lentidão no atendimento, dificuldade no controle de devoluções e falta de dados para a gestão do acervo.

Este sistema web propõe uma solução centralizada e moderna, permitindo:
- ✅ Cadastro e gestão de livros (CRUD completo)
- ✅ Gestão de membros/usuários com controle de permissões
- ✅ Registro digital de empréstimos e devoluções
- ✅ Consulta rápida do acervo e situação de cada membro
- ✅ Autenticação segura com JWT
- ✅ Interface responsiva e intuitiva

## 👥 Equipe

- **Rafael Rabelo Pereira Damaso** - 202410365
- **João Vitor Givisiez Lessa** - 202321062
- **Pyêtro Augusto Malaquias** - 202320976

---

## 🛠️ Stack Tecnológico

### Frontend
- **React** 19.2.0
- **Axios** 1.13.2 (HTTP client)
- **React Router** 7.9.6 (navegação)
- **Node.js** 20.x
- **npm** para gerenciamento de dependências

### Backend
- **Java** 17
- **Spring Boot** 3.5.7
- **Spring Security** (JWT Authentication)
- **Spring Data JPA**
- **Maven** 3.9+ (build tool)
- **PostgreSQL JDBC Driver**

### Banco de Dados
- **PostgreSQL** 18.1
- Porta padrão: `5432`
- Database: `biblioteca`
- Usuário: `postgres`
- Senha: `2202`

### Outros
- **JWT** (jjwt-api 0.12.3) para tokens de autenticação
- **BCrypt** para hash de senhas
- **Docker** (opcional para PostgreSQL)

---

## 📁 Estrutura do Projeto

```
projeto-biblioteca/
├── back-end/demo/                      # Backend Spring Boot
│   ├── src/main/java/vitual/libary/demo/
│   │   ├── DemoApplication.java        # Classe principal
│   │   ├── config/                     # Configurações (Security, CORS)
│   │   ├── controller/                 # REST Controllers
│   │   ├── dto/                        # Data Transfer Objects
│   │   ├── entity/                     # Entidades JPA
│   │   ├── exception/                  # Tratamento de exceções
│   │   ├── repository/                 # Repositórios JPA
│   │   ├── security/                   # Segurança e JWT
│   │   └── service/                    # Lógica de negócio
│   ├── src/main/resources/
│   │   ├── application.properties      # Configuração PostgreSQL
│   │   └── application-prod.properties # Config produção
│   ├── pom.xml                         # Dependências Maven
│   └── mvnw / mvnw.cmd                 # Maven Wrapper
│
├── front-end/                          # Frontend React
│   ├── src/
│   │   ├── components/                 # Componentes React
│   │   │   └── Navbar.js              # Barra de navegação
│   │   ├── pages/                      # Páginas da aplicação
│   │   │   ├── Login.js               # Página de login
│   │   │   ├── Dashboard.js           # Dashboard principal
│   │   │   ├── LivrosPage.js          # Gestão de livros
│   │   │   ├── MembrosPage.js         # Gestão de membros
│   │   │   └── EmprestimosPage.js     # Gestão de empréstimos
│   │   ├── services/
│   │   │   └── api.js                 # Configuração do Axios
│   │   ├── App.js                      # Componente raiz
│   │   └── index.js                    # Entry point
│   ├── public/
│   │   └── index.html                  # HTML base
│   ├── package.json                    # Dependências npm
│   └── README.md                       # Docs do frontend
│
├── docs/                               # Documentação do projeto
│   ├── diagramas/                      # Diagramas UML
│   │   ├── Casos_De_Uso.drawio
│   │   ├── Diagrama_de_classes.drawio
│   │   ├── Diagrama_de_Implantação.drawio
│   │   ├── Diagrama_de_pacotes.drawio
│   │   └── Diagrama_de_Sequência.drawio
│   ├── Padrões_de_Codificacao.md
│   └── Padrões\ Adotados/
│
├── MAPA_ROTAS_ENDPOINTS.md             # Documentação de endpoints
├── DIAGNOSTICO_LOGIN.md                # Diagnóstico de login
├── GeneratePassword.java               # Utilitário de hash
└── README.md                           # Este arquivo
```

---

## 🚀 Guia de Instalação e Execução

### ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Java JDK 17+** (verifique com `java -version`)
- **Node.js 20.x** (verifique com `node --version`)
- **PostgreSQL 18+** (verifique com `psql --version`)
- **Git** (verifique com `git --version`)

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/DamasoRafael/projeto-biblioteca.git
cd projeto-biblioteca
```

### 2️⃣ Configurar o Banco de Dados PostgreSQL

#### Opção A: Instalação Local (Windows)
1. Baixe e instale o PostgreSQL de https://www.postgresql.org/download/windows/
2. Configure a senha do usuário `postgres` como `2202` durante a instalação
3. Abra o pgAdmin (geralmente na porta 5050) e crie um banco de dados chamado `biblioteca`

#### Opção B: Usar Docker (recomendado)
```bash
cd back-end/demo
docker-compose up -d
```

### 3️⃣ Executar o Backend (Java/Spring Boot)

```bash
cd back-end/demo

# No Windows (usando Maven Wrapper):
.\mvnw.cmd spring-boot:run

# No macOS/Linux:
./mvnw spring-boot:run
```

Ou use um IDE como VS Code/Eclipse e execute a classe `DemoApplication.java`.

**Backend estará disponível em:** `http://localhost:8080`

### 4️⃣ Executar o Frontend (React)

Abra um novo terminal:

```bash
cd front-end

# Instalar dependências (primeira vez apenas):
npm install

# Iniciar servidor de desenvolvimento:
npm start
```

**Frontend estará disponível em:** `http://localhost:3000`

---

## 🔐 Autenticação e Login

### Usuários Padrão (Desenvolvimento)

| Email | Senha | Perfil | ID |
|-------|-------|--------|-----|
| joao@example.com | qualquer | BIBLIOTECARIO | 1 |
| maria@example.com | qualquer | MEMBRO | 2 |
| carlos@example.com | qualquer | MEMBRO | 3 |
| ana@example.com | qualquer | MEMBRO | 4 |
| pedro@example.com | qualquer | MEMBRO | 5 |

**Nota:** Para desenvolvimento, a validação de senha foi desabilitada (aceita qualquer valor).

### Como Fazer Login

1. Abra `http://localhost:3000` no navegador
2. Insira um email e qualquer senha
3. Clique em "Login"
4. Você será redirecionado para o Dashboard

---

## 📡 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/register` - Registrar novo usuário

### Livros
- `GET /api/books?page=0&size=10` - Listar livros com paginação
- `GET /api/books/{id}` - Obter detalhes de um livro
- `POST /api/books` - Criar novo livro
- `PUT /api/books/{id}` - Atualizar livro
- `DELETE /api/books/{id}` - Deletar livro

### Membros
- `GET /api/users` - Listar todos os usuários
- `GET /api/users/{id}` - Obter detalhes de um usuário
- `POST /api/users` - Criar novo usuário
- `PUT /api/users/{id}` - Atualizar usuário
- `DELETE /api/users/{id}` - Deletar usuário

### Empréstimos
- `GET /api/loans` - Listar empréstimos
- `POST /api/loans` - Criar novo empréstimo
- `PUT /api/loans/{id}` - Atualizar empréstimo (devolver livro)

**Veja `MAPA_ROTAS_ENDPOINTS.md` para documentação completa.**

---

## 🔧 Compilação e Build

### Build Backend (JAR executável)
```bash
cd back-end/demo
.\mvnw.cmd clean package -DskipTests
```

O arquivo JAR será gerado em `target/demo-0.0.1-SNAPSHOT.jar`

### Build Frontend
```bash
cd front-end
npm run build
```

Gera pasta `build/` com arquivos otimizados para produção.

---

## 🧪 Testes

### Backend
```bash
cd back-end/demo
.\mvnw.cmd test
```

### Frontend
```bash
cd front-end
npm test
```

---

## 📝 Convenções de Commit

A equipe segue o padrão **Conventional Commits**:

```
feat: adiciona nova funcionalidade
fix: corrige um bug
docs: atualiza documentação
test: adiciona ou modifica testes
style: formata código (não altera lógica)
refactor: refatora código
chore: atualizações de build, dependencies, etc
```

Exemplo:
```bash
git commit -m "feat: implementa gestão de empréstimos"
git commit -m "fix: corrige validação de livros disponíveis"
```

---

## 🤝 Regras de Desenvolvimento

1. **Branches:** Use `feature/`, `fix/`, `docs/` como prefixo
2. **Pull Requests:** Faça PR para `main` com descrição clara
3. **Code Review:** Mínimo 1 aprovação antes de merge
4. **Main Protegida:** Não faça commit direto na `main`
5. **.gitignore:** Sempre ignore `node_modules/`, `target/`, `.env`

---

## 📚 Documentação Adicional

- [Padrões de Codificação](./docs/Padroes_de_Codificacao.md)
- [Regras de Requisito](./docs/Padrões%20Adotados/Regras_De_Requisito.md)
- [Mapa de Rotas e Endpoints](./MAPA_ROTAS_ENDPOINTS.md)
- [Diagnóstico de Login](./DIAGNOSTICO_LOGIN.md)

---

## 🐛 Troubleshooting

### Erro: "Connection refused" no PostgreSQL
- Verifique se o PostgreSQL está rodando: `psql -U postgres`
- Confirme credenciais em `application.properties`

### Erro: "Port 8080 already in use"
```bash
# Windows - Matar processo na porta 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Frontend não conecta ao backend
- Verifique CORS em `SecurityConfig.java`
- Confirme URL do backend em `front-end/src/services/api.js`
- Teste manualmente: `curl http://localhost:8080/api/books`

### Spring Boot não encontra mvnw.cmd
```bash
# Certifique-se de estar no diretório correto
cd back-end/demo
.\mvnw.cmd spring-boot:run
```

---

## 📞 Suporte

Para dúvidas ou issues:
1. Verifique a documentação em `/docs`
2. Consulte issues do GitHub
3. Entre em contato com a equipe

---

## 📄 Licença

Este projeto é desenvolvido como trabalho acadêmico.

---

**Última atualização:** Dezembro 2025
