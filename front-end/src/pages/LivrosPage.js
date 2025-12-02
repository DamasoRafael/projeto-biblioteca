import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { livroService } from '../services/api';

function LivrosPage({ onLogout }) {
    const [livros, setLivros] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [formData, setFormData] = useState({
        titulo: '',
        autor: '',
        anoPublicacao: new Date().getFullYear(),
        isbn: '',
        quantidadeTotal: 1,
    });

    useEffect(() => {
        fetchLivros();
    }, [currentPage, pageSize, searchTerm]);

    const fetchLivros = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await livroService.listar(currentPage, pageSize, searchTerm);
            const data = response.data;
            
            // Verifica se é resposta paginada ou array simples
            if (data.content) {
                setLivros(data.content);
                setTotalPages(data.totalPages || 1);
                setTotalElements(data.totalElements || 0);
            } else if (Array.isArray(data)) {
                setLivros(data);
                setTotalPages(1);
                setTotalElements(data.length);
            } else {
                setLivros([]);
                setTotalPages(0);
                setTotalElements(0);
            }
        } catch (err) {
            setError('Erro ao buscar livros');
            console.error(err);
            setLivros([]);
            setTotalPages(0);
            setTotalElements(0);
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

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0); // Volta para primeira página
    };

    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        setPageSize(newSize);
        setCurrentPage(0); // Volta para primeira página
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
            setCurrentPage(0);
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
        window.scrollTo(0, 0);
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

    const goToPage = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <Navbar onLogout={onLogout} />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1>📚 Gestão de Acervo (Livros)</h1>

                {error && <div style={{ color: 'red', marginBottom: '20px', padding: '10px', background: '#ffe0e0', borderRadius: '4px' }}>❌ {error}</div>}

                {/* Formulário */}
                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
                    <h3>{editingId ? 'Editar Livro (RF03)' : 'Cadastrar Novo Livro (RF01)'}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input 
                            type="text" 
                            name="titulo" 
                            placeholder="Título" 
                            value={formData.titulo} 
                            onChange={handleInputChange} 
                            required 
                            style={{ padding: '8px', gridColumn: '1 / -1', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <input 
                            type="text" 
                            name="autor" 
                            placeholder="Autor" 
                            value={formData.autor} 
                            onChange={handleInputChange} 
                            required 
                            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <input 
                            type="number" 
                            name="anoPublicacao" 
                            placeholder="Ano de Publicação" 
                            value={formData.anoPublicacao} 
                            onChange={handleInputChange} 
                            required 
                            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <input 
                            type="text" 
                            name="isbn" 
                            placeholder="ISBN" 
                            value={formData.isbn} 
                            onChange={handleInputChange} 
                            style={{ padding: '8px', gridColumn: '1 / -1', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <input 
                            type="number" 
                            name="quantidadeTotal" 
                            placeholder="Quantidade Total" 
                            value={formData.quantidadeTotal} 
                            onChange={handleInputChange} 
                            required 
                            min="1"
                            style={{ padding: '8px', gridColumn: '1 / -1', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        
                        <div style={{ display: 'flex', gap: '10px', gridColumn: '1 / -1', marginTop: '10px' }}>
                            <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', flex: 1, borderRadius: '4px', fontWeight: 'bold' }}>
                                {editingId ? 'Salvar Alterações' : 'Cadastrar Livro'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={resetForm} style={{ padding: '10px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Controles de Busca e Paginação */}
                <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'center' }}>
                    <div>
                        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>🔍 Buscar por Título:</label>
                        <input 
                            type="text"
                            placeholder="Digite o título..."
                            value={searchTerm}
                            onChange={handleSearch}
                            style={{ padding: '8px', width: '100%', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div>
                        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Itens por página:</label>
                        <select 
                            value={pageSize} 
                            onChange={handlePageSizeChange}
                            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>

                {/* Lista de Livros */}
                <h2>Acervo ({totalElements} livros)</h2>
                {loading && <p>⏳ Carregando...</p>}
                {!loading && livros.length === 0 && <p>Nenhum livro encontrado</p>}

                {!loading && livros.length > 0 && (
                    <>
                        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
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
                                                <button onClick={() => handleEdit(livro)} style={{ marginRight: '5px', padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✏️</button>
                                                <button onClick={() => handleDelete(livro.id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Controles de Paginação */}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '8px' }}>
                                <button 
                                    onClick={() => goToPage(0)}
                                    disabled={currentPage === 0}
                                    style={{ padding: '8px 12px', background: currentPage === 0 ? '#ccc' : '#007bff', color: currentPage === 0 ? '#666' : 'white', border: 'none', borderRadius: '4px', cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}>
                                    « Primeira
                                </button>
                                
                                <button 
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    style={{ padding: '8px 12px', background: currentPage === 0 ? '#ccc' : '#007bff', color: currentPage === 0 ? '#666' : 'white', border: 'none', borderRadius: '4px', cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}>
                                    ‹ Anterior
                                </button>

                                <span style={{ fontWeight: 'bold', padding: '0 15px' }}>
                                    Página {currentPage + 1} de {totalPages}
                                </span>

                                <button 
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage >= totalPages - 1}
                                    style={{ padding: '8px 12px', background: currentPage >= totalPages - 1 ? '#ccc' : '#007bff', color: currentPage >= totalPages - 1 ? '#666' : 'white', border: 'none', borderRadius: '4px', cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer' }}>
                                    Próxima ›
                                </button>

                                <button 
                                    onClick={() => goToPage(totalPages - 1)}
                                    disabled={currentPage >= totalPages - 1}
                                    style={{ padding: '8px 12px', background: currentPage >= totalPages - 1 ? '#ccc' : '#007bff', color: currentPage >= totalPages - 1 ? '#666' : 'white', border: 'none', borderRadius: '4px', cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer' }}>
                                    Última »
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default LivrosPage;