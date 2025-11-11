import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define a URL base da sua API (feita pelo Joao Vitor)
const API_URL = 'http://localhost:8080/api/livros';

function LivrosCRUD() {
    // State para guardar a lista de livros que vem da API
    const [livros, setLivros] = useState([]);
    
    // State para guardar os dados do formulário (para criar ou editar)
    const [formData, setFormData] = useState({
        titulo: '',
        autor: '',
        isbn: ''
    });
    
    // State para saber qual livro estamos editando (null = criando novo)
    const [editingId, setEditingId] = useState(null);

    // --- 1. FUNÇÃO DE BUSCAR (READ / CONSULTAR) ---
    // (Esta função roda quando o componente carrega)
    useEffect(() => {
        fetchLivros();
    }, []);

    const fetchLivros = async () => {
        try {
            const response = await axios.get(API_URL);
            setLivros(response.data);
        } catch (error) {
            console.error("Erro ao buscar livros:", error);
        }
    };

    // --- 2. FUNÇÃO DE CRIAR / ATUALIZAR (CREATE / UPDATE) ---
    const handleSubmit = async (e) => {
        e.preventDefault(); // Impede o refresh da página

        if (editingId) {
            // --- ATUALIZAR (UPDATE / PUT) ---
            try {
                await axios.put(`${API_URL}/${editingId}`, formData);
                alert("Livro atualizado com sucesso!");
            } catch (error) {
                console.error("Erro ao atualizar livro:", error);
                alert("Erro ao atualizar livro.");
            }
        } else {
            // --- CRIAR (CREATE / POST) ---
            try {
                await axios.post(API_URL, formData);
                alert("Livro cadastrado com sucesso!");
            } catch (error) {
                console.error("Erro ao cadastrar livro:", error);
                alert("Erro ao cadastrar livro.");
            }
        }

        // Limpa o formulário e atualiza a lista
        resetForm();
        fetchLivros();
    };

    // --- 3. FUNÇÃO DE EXCLUIR (DELETE) ---
    const handleDelete = async (id) => {
        // Pede confirmação (RF04)
        if (window.confirm("Deseja realmente excluir este livro?")) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                alert("Livro excluído com sucesso!");
                fetchLivros(); // Atualiza a lista
            } catch (error) {
                console.error("Erro ao excluir livro:", error);
                // Trata o erro (RN-03)
                if (error.response && error.response.status === 409) { // Exemplo de status 'Conflito'
                    alert("Não é possível excluir: Este livro está vinculado a um empréstimo ativo.");
                } else {
                    alert("Erro ao excluir livro.");
                }
            }
        }
    };

    // --- FUNÇÕES AUXILIARES DO FORMULÁRIO ---

    // Prepara o formulário para edição
    const handleEdit = (livro) => {
        setEditingId(livro.id); // Ajuste o 'id' para como ele vem da API (ex: livro.id_livro)
        setFormData({
            titulo: livro.titulo,
            autor: livro.autor,
            isbn: livro.isbn
        });
    };

    // Atualiza o state do formulário enquanto o utilizador digita
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Limpa o formulário
    const resetForm = () => {
        setEditingId(null);
        setFormData({
            titulo: '',
            autor: '',
            isbn: ''
        });
    };

    // --- 4. RENDERIZAÇÃO (O HTML / JSX) ---
    // (Esta é a tela que você vai tirar o printscreen para a Tarefa #10)
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            
            {/* Título da Página */}
            <h1>Gestão de Acervo (Livros)</h1>

            {/* Formulário de Cadastro e Edição */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                <h3>{editingId ? 'Editar Livro' : 'Cadastrar Novo Livro'} (RF01, RF03)</h3>
                <input
                    type="text"
                    name="titulo"
                    placeholder="Título"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="autor"
                    placeholder="Autor"
                    value={formData.autor}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="isbn"
                    placeholder="ISBN"
                    value={formData.isbn}
                    onChange={handleInputChange}
                />
                <button type="submit">{editingId ? 'Salvar Alterações' : 'Cadastrar'}</button>
                {editingId && <button type="button" onClick={resetForm}>Cancelar Edição</button>}
            </form>

            {/* Lista de Livros Cadastrados */}
            <h2>Acervo (RF02)</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {livros.map(livro => (
                    <li key={livro.id} style={{ borderBottom: '1px solid #eee', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <strong>{livro.titulo}</strong> <br />
                            <small>Autor: {livro.autor} | ISBN: {livro.isbn}</small>
                        </div>
                        <div>
                            <button onClick={() => handleEdit(livro)} style={{ marginRight: '5px' }}>Editar (RF03)</button>
                            <button onClick={() => handleDelete(livro.id)}>Excluir (RF04)</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LivrosCRUD;