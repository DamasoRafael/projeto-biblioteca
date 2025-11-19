import React, { useState, useEffect } from 'react';
import { livroService } from '../services/api'; // Importa a camada de serviço

function LivrosPage() {
    // --- ESTADOS (State) ---
    const [livros, setLivros] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        autor: '',
        isbn: ''
    });

    // --- EFEITOS (Lifecycle) ---
    // Carrega os livros assim que a página abre
    useEffect(() => {
        carregarLivros();
    }, []);

    // --- FUNÇÕES DE LÓGICA ---

    // Busca a lista de livros do Backend
    const carregarLivros = async () => {
        setLoading(true);
        try {
            const response = await livroService.listar();
            setLivros(response.data);
        } catch (error) {
            console.error("Erro ao buscar livros. O Backend está rodando?", error);
            // Não mostramos alert aqui para não ser chato se o servidor estiver off
        } finally {
            setLoading(false);
        }
    };

    // Gerencia a mudança nos inputs do formulário
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Envia o formulário (Criar ou Editar)
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                // Modo Edição (PUT)
                await livroService.atualizar(editingId, formData);
                alert("Livro atualizado com sucesso!");
            } else {
                // Modo Criação (POST)
                await livroService.salvar(formData);
                alert("Livro cadastrado com sucesso!");
            }
            
            // Limpa tudo e recarrega a lista
            resetForm();
            carregarLivros();

        } catch (error) {
            console.error("Erro ao salvar livro:", error);
            alert("Erro ao salvar. Verifique o console.");
        }
    };

    // Prepara o formulário para edição
    const handleEdit = (livro) => {
        setEditingId(livro.id);
        setFormData({
            titulo: livro.titulo,
            autor: livro.autor,
            isbn: livro.isbn
        });
    };

    // Exclui um livro
    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este livro?")) {
            try {
                await livroService.excluir(id);
                alert("Livro excluído.");
                carregarLivros();
            } catch (error) {
                console.error("Erro ao excluir:", error);
                alert("Erro ao excluir. O livro pode ter empréstimos vinculados.");
            }
        }
    };

    // Limpa o formulário
    const resetForm = () => {
        setEditingId(null);
        setFormData({ titulo: '', autor: '', isbn: '' });
    };

    // --- RENDERIZAÇÃO (JSX) ---
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Gestão de Acervo</h1>

            {/* Formulário */}
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3>{editingId ? 'Editar Livro' : 'Novo Livro'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                        type="text"
                        name="titulo"
                        placeholder="Título do Livro"
                        value={formData.titulo}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '8px' }}
                    />
                    <input
                        type="text"
                        name="autor"
                        placeholder="Autor"
                        value={formData.autor}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '8px' }}
                    />
                    <input
                        type="text"
                        name="isbn"
                        placeholder="ISBN (Opcional)"
                        value={formData.isbn}
                        onChange={handleInputChange}
                        style={{ padding: '8px' }}
                    />
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', flex: 1 }}>
                            {editingId ? 'Salvar Alterações' : 'Cadastrar Livro'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={resetForm} style={{ padding: '10px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Lista de Livros */}
            <h3>Acervo ({livros.length})</h3>
            {loading ? <p>Carregando...</p> : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {livros.length === 0 && <p>Nenhum livro cadastrado.</p>}
                    
                    {livros.map((livro) => (
                        <li key={livro.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong style={{ fontSize: '1.1em' }}>{livro.titulo}</strong>
                                <div style={{ color: '#666', fontSize: '0.9em' }}>
                                    Autor: {livro.autor} | ISBN: {livro.isbn || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <button 
                                    onClick={() => handleEdit(livro)} 
                                    style={{ marginRight: '8px', padding: '5px 10px', background: '#ffc107', border: 'none', cursor: 'pointer', borderRadius: '3px' }}>
                                    Editar
                                </button>
                                <button 
                                    onClick={() => handleDelete(livro.id)} 
                                    style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px' }}>
                                    Excluir
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default LivrosPage;