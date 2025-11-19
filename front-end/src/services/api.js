import axios from 'axios';

// Quando o backend estiver pronto, é só mudar esta URL
const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
});

export const livroService = {
    listar: () => api.get('/livros'),
    salvar: (livro) => api.post('/livros', livro),
    atualizar: (id, livro) => api.put(`/livros/${id}`, livro),
    excluir: (id) => api.delete(`/livros/${id}`),
};

export default api;