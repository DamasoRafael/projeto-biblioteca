-- Dados iniciais para testar o novo CRUD de empréstimo

-- Inserir usuários de teste
INSERT INTO users (nome, email)
VALUES ('Joao Silva', 'joao.silva@teste.com');

INSERT INTO users (nome, email)
VALUES ('Maria Santos', 'maria.santos@teste.com');

-- Inserir livros de teste
INSERT INTO books (titulo, autor, ano_publicacao, isbn)
VALUES ('O Guia do Mochileiro das Galáxias', 'Douglas Adams', 1979, '978-0345391803');

INSERT INTO books (titulo, autor, ano_publicacao, isbn)
VALUES ('1984', 'George Orwell', 1949, '978-0451524935');