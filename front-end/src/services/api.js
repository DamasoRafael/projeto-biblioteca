import axios from 'axios';

// --- CONFIGURAÇÃO BASE ---
const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- AUTENTICAÇÃO (RF09) ---
export const authService = {
    login: (email, senha) => api.post('/auth/login', { email, senha }),
    register: (nome, email, senha, role = 'MEMBRO') => 
        api.post('/auth/register', { nome, email, senha, role }),
    logout: () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_role');
    },
};

// --- LIVROS (RF01-RF04) ---
export const livroService = {
    listar: (page = 0, size = 10, titulo = '') => {
        const params = { page, size };
        if (titulo) params.titulo = titulo;
        return api.get('/books', { params });
    },
    obterPorId: (id) => api.get(`/books/${id}`),
    buscarPorTitulo: (titulo, page = 0, size = 10) => 
        api.get('/books', { params: { titulo, page, size } }),
    salvar: (livro) => api.post('/books', livro),
    atualizar: (id, livro) => api.put(`/books/${id}`, livro),
    excluir: (id) => api.delete(`/books/${id}`),
};

// --- USUÁRIOS/MEMBROS (RF10, RF11) ---
export const membroService = {
    listar: () => api.get('/users'),
    obterPorId: (id) => api.get(`/users/${id}`),
    salvar: (membro) => api.post('/users', membro),
    atualizar: (id, membro) => api.put(`/users/${id}`, membro),
    excluir: (id) => api.delete(`/users/${id}`),
};

// --- EMPRÉSTIMOS (RF05-RF08, RF12) ---
export const emprestimoService = {
    listar: () => api.get('/loans'),
    listarPorUsuario: (userId) => api.get('/loans', { params: { userId } }),
    listarAtivos: () => api.get('/loans', { params: { returned: false } }),
    listarDevolvidos: () => api.get('/loans', { params: { returned: true } }),
    obterPorId: (id) => api.get(`/loans/${id}`),
    emprestar: (bookId, userId) => api.post('/loans/borrow', { bookId, userId }),
    devolver: (loanId) => api.put(`/loans/${loanId}/return`),
    atualizar: (loanId, bookId, userId) => api.put(`/loans/${loanId}`, { bookId, userId }),
    deletar: (loanId) => api.delete(`/loans/${loanId}`),
};

// Exporte o axios configurado
export default api;