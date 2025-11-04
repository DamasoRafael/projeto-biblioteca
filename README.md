# Projeto Final GCC 188 - Sistema de Biblioteca

## CONTEXTO DO PROBLEMA E SOLUÇÃO

Bibliotecas locais e acadêmicas frequentemente dependem de processos manuais, como fichas de papel, ou sistemas legados para o gerenciamento de seu acervo e empréstimos. Isso resulta em lentidão no atendimento, dificuldade no controle de devoluções e falta de dados para a gestão do acervo.

Este sistema web propõe uma solução centralizada, permitindo o cadastro de livros e membros, o registro digital de empréstimos e devoluções, e a consulta rápida do acervo e da situação de cada membro.

## INSTRUÇÕES PARA USO

(Instruções para o usuário final do sistema)

1.  Acesse o sistema pela URL [URL_DO_DEPLOY_QUANDO_HOUVER].
2.  Faça login com seu usuário e senha (ex: perfil de Bibliotecário ou Membro).
3.  Use o menu de navegação para acessar as seções de Livros, Membros e Empréstimos.

## INSTRUÇÕES PARA DEVS

(Instruções para um novo desenvolvedor configurar o ambiente e rodar o projeto)

### 3.1 - Clonar o projeto

git clone https://github.com/DamasoRafael/projeto-biblioteca
cd projeto-biblioteca

### 3.2 - Configurar o Banco de Dados (PostgreSQL Manual)

O projeto requer uma instalação local do PostgreSQL. Todos os membros da equipe devem configurar seus ambientes locais com as exatas credenciais padronizadas abaixo para garantir que o projeto funcione para todos.

Instalação: Baixe e instale o PostgreSQL (versão 15 ou superior) a partir do site oficial.

Porta: Durante a instalação, quando solicitado, defina a porta como 5433.

Configuração Pós-Instalação:

Abra o pgAdmin (instalado junto com o PostgreSQL).

Conecte-se ao seu servidor local (usando a senha de superusuário postgres que você criou na instalação).

Crie um novo "Login/Group Role" com o nome: admin_biblioteca e a senha: 1234
(Garanta que ele "Can login").

Crie um novo "Database" com o nome: biblioteca_db e defina o "Owner" (Dono) como admin_biblioteca.

### 3.3 - Executar o Back-end (Java/Spring)

Abra a pasta /backend na sua IDE (ex: VS ou Eclipse).

Aguarde a IDE baixar as dependências do Maven.

Confirme que o arquivo src/main/resources/application.properties (ou .yml) do Spring Boot está configurado para usar as credenciais padronizadas:

Properties

spring.datasource.url=jdbc:postgresql://localhost:5433/biblioteca_db
spring.datasource.username=admin_biblioteca
spring.datasource.password=senha-padrao-do-projeto-123
spring.jpa.hibernate.ddl-auto=update
Execute a classe principal da aplicação Spring (ex: BibliotecaApplication.java).

O back-end estará rodando em http://localhost:8080.

### 3.4 - Executar o Front-end (React)

Abra um novo terminal e navegue para a pasta do front-end:

Bash

cd frontend-react
Instale as dependências do Node.js (só é necessário na primeira vez):

Bash

npm install
Inicie o servidor de desenvolvimento:

Bash

npm start
Acesse o sistema no seu navegador em http://localhost:3000.

### 4. TECNOLOGIAS

(Esta seção cumpre os requisitos da Tarefa #3 da Fase 0)

frontend: React (v18.x), Node.js (v20.x)

backend: Java (v17), Spring Boot (v3.x)

banco de dados: PostgreSQL (v18)

outras: Maven, JUnit 5, Selenium

### 5. ORGANIZAÇÃO DO PROJETO

(Esta seção cumpre os requisitos da Tarefa #4 da Fase 0)

.
├── /back-end/ # Código-fonte principal da aplicação Java/Spring
├── /front-end/ # Código-fonte principal da aplicação React
│ ├── /src/components/ # Componentes reutilizáveis da interface
│ └── /src/utils/ # Funções auxiliares e utilitárias
├── /docs/ # Documentação do projeto
│ └── /Padrões Adotados/ # Padrões de requisitos (Tarefa #5)
├── /tests/ # Scripts de testes automatizados (Selenium)
└── README.md # Este arquivo

# Equipe:

-Rafael Rabelo Pereira Damaso - 202410365

```

```
