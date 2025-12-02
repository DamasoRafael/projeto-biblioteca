# 🔍 DIAGNÓSTICO E SOLUÇÃO - Login não funciona

## 📋 Problemas Identificados

1. **Usuários de teste não existem no PostgreSQL**
   - Email: `joao.silva@teste.com` não encontrado
   - Email: `maria.santos@teste.com` não encontrado

2. **Banco de dados vazio**
   - Tabela `users` sem dados
   - Tabela `books` sem dados

---

## ✅ SOLUÇÃO PASSO A PASSO

### Opção 1: Usando pgAdmin (Recomendado)

1. Abra o **pgAdmin** no navegador: `http://localhost:5050`
   - Username: `pgadmin4@pgadmin.org`
   - Senha: `admin`

2. Navegue até: **Servers > PostgreSQL > Databases > biblioteca > Schemas > public > Tables**

3. Clique em **Query Tool** (ícone de play ▶️ no topo)

4. Copie e cole o conteúdo do arquivo `INSERT_TEST_DATA.sql`

5. Execute a query (F5 ou Ctrl+Enter)

---

### Opção 2: Usando DBeaver (Alternativo)

1. Abra o **DBeaver**

2. Crie uma conexão com:
   - Host: `localhost`
   - Port: `5432`
   - Database: `biblioteca`
   - User: `postgres`
   - Password: `2202`

3. Execute o script `INSERT_TEST_DATA.sql`

---

### Opção 3: Usando Terminal (Avançado)

Se tiver `psql` instalado:

```powershell
psql -U postgres -d biblioteca -f "c:\Users\joaog\projeto-biblioteca\back-end\demo\INSERT_TEST_DATA.sql"
```

---

## 🔐 Credenciais de Teste (após inserir dados)

**Bibliotecário:**
- Email: `joao.silva@teste.com`
- Senha: `senha123`
- Role: `BIBLIOTECARIO`

**Membro:**
- Email: `maria.santos@teste.com`
- Senha: `senha123`
- Role: `MEMBRO`

---

## 🧪 Teste após inserir dados

1. Faça login no navegador: `http://localhost:3000`
2. Use uma das credenciais acima
3. Se funcionar, o problema foi resolvido!

---

## 🐛 Se ainda não funcionar

Execute estes comandos no terminal para verificar:

```powershell
# Verificar se o backend está rodando
$response = curl -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"joao.silva@teste.com","senha":"senha123"}' -ErrorAction SilentlyContinue
$response | ConvertFrom-Json
```

Isso deve retornar um objeto com `token`, `userId`, `nome`, etc.

---

## 📊 Resumo da Aplicação

| Componente | Status | Porta |
|-----------|--------|-------|
| Frontend (React) | ✅ Rodando | 3000 |
| Backend (Spring Boot) | ✅ Rodando | 8080 |
| PostgreSQL | ✅ Rodando | 5432 |
| Dados de Teste | ❌ Pendente | - |

**Próximo Passo:** Inserir dados de teste no PostgreSQL
