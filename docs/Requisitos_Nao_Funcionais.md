# Requisitos Não-Funcionais (RNF)

Esta lista define as qualidades e restrições do Sistema de Biblioteca, conforme a Tarefa #9 da Sprint 1.

## Tecnologia

- **RNF01:** O back-end do sistema deve ser desenvolvido em Java (v17+) e Spring Boot (v3+).
- **RNF02:** O front-end do sistema deve ser desenvolvido com a biblioteca React (v18+).
- **RNF03:** O banco de dados deve ser o PostgreSQL (v15+), configurado na porta 5433 para o ambiente de desenvolvimento.
- **RNF04:** O projeto deve utilizar Maven para gerenciamento de dependências do back-end.

## Segurança

- **RNF05:** A senha dos usuários deve ser armazenada no banco de dados de forma criptografada (ex: BCrypt).
- **RNF06:** O acesso às rotas de API de administração (CRUDs) deve ser protegido e exigir um token de autenticação válido (ex: JWT).

## Usabilidade

- **RNF07:** O sistema deve ser compatível com as versões mais recentes dos navegadores Google Chrome, Firefox e Microsoft Edge.
- **RNF08:** O layout do sistema deve ser responsivo, adaptando-se a telas de desktop e smartphones.

## Desempenho

- **RNF09:** As consultas ao acervo de livros (RF06) devem retornar resultados em menos de 3 segundos.
