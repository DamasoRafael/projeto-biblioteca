-- =============================================
-- INSERÇÃO DE USUÁRIOS
-- =============================================

INSERT INTO users (nome, email) VALUES ('João Silva', 'joao.silva@teste.com');
INSERT INTO users (nome, email) VALUES ('Maria Santos', 'maria.santos@teste.com');
INSERT INTO users (nome, email) VALUES ('Carlos Oliveira', 'carlos.oliveira@teste.com');
INSERT INTO users (nome, email) VALUES ('Ana Costa', 'ana.costa@teste.com');
INSERT INTO users (nome, email) VALUES ('Pedro Ferreira', 'pedro.ferreira@teste.com');

-- =============================================
-- INSERÇÃO DE 30 LIVROS COM CONTROLE DE ESTOQUE
-- =============================================

-- Página 1 (Livros 1-10)
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('O Guia do Mochileiro das Galáxias', 'Douglas Adams', 1979, '978-0345391803', 5, 5);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('1984', 'George Orwell', 1949, '978-0451524935', 3, 3);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('Dom Casmurro', 'Machado de Assis', 1899, '978-8525406946', 4, 4);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('O Cortiço', 'Aluísio Azevedo', 1890, '978-8535908078', 2, 2);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('Harry Potter e a Pedra Filosofal', 'J.K. Rowling', 1998, '978-8532530787', 6, 6);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('O Senhor dos Anéis', 'J.R.R. Tolkien', 1954, '978-0544003415', 4, 4);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 1943, '978-0156012195', 8, 8);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('A Revolução dos Bichos', 'George Orwell', 1945, '978-0451526342', 5, 5);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('O Código Da Vinci', 'Dan Brown', 2003, '978-0307474278', 3, 3);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('O Alquimista', 'Paulo Coelho', 1988, '978-0062315007', 7, 7);

-- Página 2 (Livros 11-20)
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('Cem Anos de Solidão', 'Gabriel García Márquez', 1967, '978-0060883287', 4, 4);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('A Menina que Roubava Livros', 'Markus Zusak', 2005, '978-0375831003', 5, 5);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('O Hobbit', 'J.R.R. Tolkien', 1937, '978-0547928227', 6, 6);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('A Culpa é das Estrelas', 'John Green', 2012, '978-0143039990', 5, 5);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('O Lado Bom da Vida', 'Matthew Quick', 2008, '978-0446572278', 3, 3);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('A Revolução Industrial', 'Eric Hobsbawm', 1962, '978-0679754435', 2, 2);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('Sapiens', 'Yuval Noah Harari', 2011, '978-0062316097', 4, 4);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('Humano, Demasiado Humano', 'Friedrich Nietzsche', 1878, '978-0521585989', 2, 2);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('Crítica da Razão Pura', 'Immanuel Kant', 1781, '978-0521657297', 1, 1);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('A Origem das Espécies', 'Charles Darwin', 1859, '978-0140436174', 3, 3);

-- Página 3 (Livros 21-30)
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('Capital', 'Karl Marx', 1867, '978-0140436647', 2, 2);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('O Segundo Sexo', 'Simone de Beauvoir', 1949, '978-0307818522', 4, 4);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('O Contrato Social', 'Jean-Jacques Rousseau', 1762, '978-0141441497', 3, 3);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('Fenomenologia do Espírito', 'Georg Wilhelm Friedrich Hegel', 1807, '978-0198237273', 1, 1);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('Crime e Castigo', 'Fiódor Dostoiévski', 1866, '978-0143039990', 4, 4);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('Anna Karenina', 'Lev Tolstói', 1877, '978-0143039990', 3, 3);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('O Grande Gatsby', 'F. Scott Fitzgerald', 1925, '978-0743273565', 5, 5);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('Jane Eyre', 'Charlotte Brontë', 1847, '978-0141441146', 4, 4);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('O Morro dos Ventos Uivantes', 'Emily Brontë', 1847, '978-0141439556', 3, 3);
INSERT INTO books (titulo, autor, ano_publicacao, isbn, quantidade_total, quantidade_disponivel) VALUES ('Orgulho e Preconceito', 'Jane Austen', 1813, '978-0141439518', 6, 6);