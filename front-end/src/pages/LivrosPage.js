import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { livroService } from '../services/api';

function LivrosPage({ onLogout }) {
    const [livros, setLivros] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        titulo: '',
        autor: '',
        anoPublicacao: new Date().getFullYear(),
        isbn: '',
        quantidadeTotal: 1,
    });

    useEffect(() => {
        fetchLivros();
    }, []);

    const fetchLivros = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await livroService.listar();
            // Se a resposta é paginada
            const data = response.data.content || response.data;
            setLivros(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Erro ao buscar livros');
            console.error(err);
            setLivros([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ 
            ...formData, 
            [name]: name === 'anoPublicacao' || name === 'quantidadeTotal' ? parseInt(value) : value 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const payload = {
                titulo: formData.titulo,
                autor: formData.autor,
                anoPublicacao: formData.anoPublicacao,
                isbn: formData.isbn,
                quantidadeTotal: formData.quantidadeTotal,
                quantidadeDisponivel: formData.quantidadeTotal,
            };

            if (editingId) {
                await livroService.atualizar(editingId, payload);
                alert('Livro atualizado com sucesso!');
            } else {
                await livroService.salvar(payload);
                alert('Livro cadastrado com sucesso!');
            }
            resetForm();
            fetchLivros();
        } catch (err) {
            setError(err.response?.data || 'Erro ao salvar livro');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este livro?')) {
            try {
                await livroService.excluir(id);
                alert('Livro excluído com sucesso!');
                fetchLivros();
            } catch (err) {
                setError('Erro ao excluir livro');
                console.error(err);
            }
        }
    };

    const handleEdit = (livro) => {
        setEditingId(livro.id);
        setFormData({
            titulo: livro.titulo,
            autor: livro.autor,
            anoPublicacao: livro.anoPublicacao,
            isbn: livro.isbn,
            quantidadeTotal: livro.quantidadeTotal,
        });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            titulo: '',
            autor: '',
            anoPublicacao: new Date().getFullYear(),
            isbn: '',
            quantidadeTotal: 1,
        });
    };

    return (
        <div>
            <Navbar onLogout={onLogout} />
            <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                <h1>📚 Gestão de Acervo (Livros)</h1>

                {error && <div style={{ color: 'red', marginBottom: '20px' }}>❌ {error}</div>}

                {/* Formulário */}
                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3>{editingId ? 'Editar Livro (RF03)' : 'Cadastrar Novo Livro (RF01)'}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input 
                            type="text" 
                            name="titulo" 
                            placeholder="Título" 
                            value={formData.titulo} 
                            onChange={handleInputChange} 
                            required 
                            style={{ padding: '8px', gridColumn: '1 / -1' }}
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
                            type="number" 
                            name="anoPublicacao" 
                            placeholder="Ano de Publicação" 
                            value={formData.anoPublicacao} 
                            onChange={handleInputChange} 
                            required 
                            style={{ padding: '8px' }}
                        />
                        <input 
                            type="text" 
                            name="isbn" 
                            placeholder="ISBN" 
                            value={formData.isbn} 
                            onChange={handleInputChange} 
                            style={{ padding: '8px', gridColumn: '1 / -1' }}
                        />
                        <input 
                            type="number" 
                            name="quantidadeTotal" 
                            placeholder="Quantidade Total" 
                            value={formData.quantidadeTotal} 
                            onChange={handleInputChange} 
                            required 
                            min="1"
                            style={{ padding: '8px' }}
                        />
                        
                        <div style={{ display: 'flex', gap: '10px', gridColumn: '1 / -1', marginTop: '10px' }}>
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
                <h2>Acervo ({livros.length})</h2>
                {loading && <p>⏳ Carregando...</p>}
                {!loading && livros.length === 0 && <p>Nenhum livro cadastrado</p>}

                {!loading && livros.length > 0 && (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Título</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Autor</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Ano</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Quantidade</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Disponível</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {livros.map(livro => (
                                    <tr key={livro.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '10px' }}>{livro.titulo}</td>
                                        <td style={{ padding: '10px' }}>{livro.autor}</td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>{livro.anoPublicacao}</td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>{livro.quantidadeTotal}</td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            <span style={{ 
                                                backgroundColor: livro.quantidadeDisponivel > 0 ? '#28a745' : '#dc3545',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px'
                                            }}>
                                                {livro.quantidadeDisponivel}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            <button onClick={() => handleEdit(livro)} style={{ marginRight: '5px', padding: '5px 10px' }}>✏️</button>
                                            <button onClick={() => handleDelete(livro.id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LivrosPage;