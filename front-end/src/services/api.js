import axios from 'axios';

// --- CONFIGURAÇÃO BASE ---
const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
});

// --- LIVROS (RF01-RF04) ---
export const livroService = {
    listar: () => api.get('/livros'),
    salvar: (livro) => api.post('/livros', livro),
    atualizar: (id, livro) => api.put(`/livros/${id}`, livro),
    excluir: (id) => api.delete(`/livros/${id}`),
};

// --- MEMBROS (RF10, RF11) ---
export const membroService = { // <--- ESTA EXPORTAÇÃO FALTAVA
    listar: () => api.get('/membros'),
    salvar: (membro) => api.post('/membros', membro),
    atualizar: (id, membro) => api.put(`/membros/${id}`, membro),
    excluir: (id) => api.delete(`/membros/${id}`),
};

// --- EMPRÉSTIMOS (RF05-RF08, RF12) ---
export const emprestimoService = { // <--- ESTA EXPORTAÇÃO FALTAVA
    listar: (membroId) => {
        // A API Java deve tratar o filtro por ID de membro
        const url = membroId ? `/emprestimos/membro/${membroId}` : '/emprestimos';
        return api.get(url);
    },
    salvar: (emprestimo) => api.post('/emprestimos', emprestimo),
    registrarDevolucao: (id) => api.put(`/emprestimos/${id}/devolver`), 
};

// Exporte todos os serviços
// Se quiser exportar o axios configurado, pode usar:
export default api;