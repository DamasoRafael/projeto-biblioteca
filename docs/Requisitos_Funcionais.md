# Requisitos Funcionais (RF)

Esta lista define as funcionalidades do Sistema de Biblioteca, conforme a Tarefa #8 da Sprint 1.

## Módulo de Autenticação

- **RF01:** O sistema deve permitir que usuários (Bibliotecários, Membros) façam login.
- **RF02:** O sistema deve manter o usuário autenticado enquanto ele navega pelas páginas protegidas.

## Módulo de Livros (CRUD Simples - 1 Tabela)

- **RF03:** O sistema deve permitir ao Bibliotecário cadastrar um novo livro no acervo.
- **RF04:** O sistema deve permitir ao Bibliotecário alterar os dados de um livro existente.
- **RF05:** O sistema deve permitir ao Bibliotecário excluir um livro do acervo.
- **RF06:** O sistema deve permitir que qualquer usuário (logado ou não) consulte o acervo de livros (buscar por título, autor, etc.).

## Módulo de Membros

- **RF07:** O sistema deve permitir ao Bibliotecário cadastrar um novo membro (leitor).
- **RF08:** O sistema deve permitir ao Bibliotecário consultar e alterar dados de um membro.
- **RF09:** O sistema deve permitir ao Bibliotecário desativar (ou excluir) um membro.

## Módulo de Empréstimos (CRUD Complexo - 3+ Tabelas)

- **RF10:** O sistema deve permitir ao Bibliotecário registrar um empréstimo, vinculando um (1) Membro a um (1) Livro e salvando na tabela de Empréstimos.
- **RF11:** O sistema deve impedir um novo empréstimo se o Membro tiver pendências (atrasos) ou se o Livro estiver indisponível.
- **RF12:** O sistema deve permitir ao Bibliotecário registrar a devolução de um livro.
- **RF13:** O sistema deve permitir que um Membro (logado) consulte seu próprio histórico de empréstimos (ativos e passados).
