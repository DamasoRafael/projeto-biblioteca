# Projeto Final GCC 188 - Sistema de Biblioteca

## CONTEXTO DO PROBLEMA E SOLUÇÃO

Bibliotecas locais e acadêmicas frequentemente dependem de processos manuais, como fichas de papel, ou sistemas legados para o gerenciamento de seu acervo e empréstimos. Isso resulta em lentidão no atendimento, dificuldade no controle de devoluções e falta de dados para a gestão do acervo.

Este sistema web propõe uma solução centralizada, permitindo o cadastro de livros e membros, o registro digital de empréstimos e devoluções, e a consulta rápida do acervo e da situação de cada membro.

## FUNCIONALIDADES ENTREGUES (SPRINT FINAL)

O sistema cumpre os requisitos estabelecidos nas etapas de planejamento e desenvolvimento:

* **Gestão de Membros (Tarefa #26):** CRUD completo (Cadastro, Leitura, Atualização e Exclusão).
* **Gestão de Empréstimos (Tarefa #29):** Lógica de negócio com validação de disponibilidade e regras de empréstimo.
* **Qualidade e Testes (Tarefas #30 e #31):** Cobertura de testes unitários e validação funcional.

## INSTRUÇÕES PARA USO

(Instruções para o usuário final do sistema)

1.  Acesse o sistema pela URL [URL_DO_DEPLOY_QUANDO_HOUVER].
2.  Faça login com seu usuário e senha (ex: perfil de Bibliotecário ou Membro).
3.  Use o menu de navegação para acessar as seções de Livros, Membros e Empréstimos.

## 3. INSTRUÇÕES PARA DEVS (SETUP)

*(Instruções para um novo desenvolvedor configurar o ambiente e rodar o projeto)*

### 3.1 - Clonar o repositório
```bash
git clone https://github.com/DamasoRafael/projeto-biblioteca.git
cd projeto-biblioteca
```

### 3.2 - Configurar o Banco de Dados (Via Docker)

Para garantir a padronização do ambiente e atender à **Tarefa #25**, substituímos a instalação manual pelo Docker.

Certifique-se de ter o **Docker Desktop** instalado e rodando. Na raiz do projeto, execute:

```bash
docker-compose up -d
```

Isso subirá o banco PostgreSQL automaticamente na porta configurada, com o usuário e banco `biblioteca_db` já criados.

### 3.3 - Executar o Back-end (Java/Spring)

1. Abra a pasta /backend na sua IDE (ex: VS Code ou Eclipse).

2. Aguarde a IDE baixar as dependências do Maven.

3. Execute a classe principal da aplicação Spring (ex: BibliotecaApplication.java).

4. O back-end estará rodando em http://localhost:8080.

### 3.4 - Executar o Front-end (React)

1. Abra um novo terminal e navegue para a pasta do front-end:

```bash
cd frontend-react
```

2. Instale as dependências do Node.js (só é necessário na primeira vez):

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm start
```

4. Acesse o sistema no seu navegador em http://localhost:3000.

### 4. TECNOLOGIAS

(Esta seção cumpre os requisitos da Tarefa #3 da Fase 0)

•frontend: React (v18.x), Node.js (v20.x)

•backend: Java (v17), Spring Boot (v3.x)

•banco de dados: PostgreSQL (v15+)

•outras: Maven, JUnit 5, Selenium, Docker

### 5. ORGANIZAÇÃO DO PROJETO

(Esta seção cumpre os requisitos da Tarefa #4 da Fase 0 e atualizações da Sprint Final)

```text
.
├── /back-end/        # Código-fonte principal da aplicação Java/Spring
├── /front-end/       # Código-fonte principal da aplicação React
│   ├── /src/components/  # Componentes reutilizáveis da interface
│   └── /src/utils/       # Funções auxiliares e utilitárias
├── /docs/            # Documentação do projeto
│   ├── /diagramas/       # Diagramas UML (Tarefas #19, #20, #25)
│   └── Documento_De_Requisitos.doc
├── /teste/           # Casos de Teste de Validação (Tarefa #31)
└── README.md         # Este arquivo
````

# Equipe:

-Rafael Rabelo Pereira Damaso - 202410365

-Joâo Vitor Givisiez Lessa - 202321062

-Pyêtro Augusto Malaquias - 202320976

## 6. Regras de Git e Versionamento

Para organizar o desenvolvimento e cumprir a **Tarefa #33**, a equipe adotou as seguintes regras:

1.  **Commits Atômicos:** Cada commit deve resolver uma pequena tarefa ou criar um arquivo específico.
2.  **Mensagens Claras:** As mensagens de commit utilizam prefixos padronizados (Conventional Commits):
    * `feat:` Novas funcionalidades.
    * `fix:` Correção de bugs.
    * `docs:` Documentação.
    * `test:` Testes.
3.  **Main Protegida:** A branch `main` contém apenas código funcional (releases).
4.  **Ignorar Arquivos:** O arquivo `.gitignore` deve ser usado para excluir arquivos de configuração da IDE e pastas de build (`target/`, `node_modules/`).
