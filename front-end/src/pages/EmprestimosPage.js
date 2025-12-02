import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { emprestimoService, livroService, membroService } from '../services/api';

function EmprestimosPage({ onLogout }) {
    const [emprestimos, setEmprestimos] = useState([]);
    const [membros, setMembros] = useState([]);
    const [livros, setLivros] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ bookId: '', userId: '' });
    const [filterStatus, setFilterStatus] = useState('todos'); // todos, ativos, devolvidos

    useEffect(() => {
        fetchData();
    }, [filterStatus]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            // Buscar dados em paralelo
            const [empRes, membRes, livRes] = await Promise.all([
                emprestimoService.listar(),
                membroService.listar(),
                livroService.listar(0, 100)
            ]);

            // Processar empréstimos
            let emprestimoData = empRes.data || [];
            if (!Array.isArray(emprestimoData)) {
                emprestimoData = [];
            }

            // Filtrar por status
            if (filterStatus === 'ativos') {
                emprestimoData = emprestimoData.filter(e => !e.returned);
            } else if (filterStatus === 'devolvidos') {
                emprestimoData = emprestimoData.filter(e => e.returned);
            }

            setEmprestimos(emprestimoData);

            // Processar membros
            const membroData = Array.isArray(membRes.data) ? membRes.data : [];
            setMembros(membroData);

            // Processar livros (pode vir paginado ou não)
            const livrosData = livRes.data.content || livRes.data;
            setLivros(Array.isArray(livrosData) ? livrosData : []);
        } catch (err) {
            setError('Erro ao carregar dados');
            console.error(err);
            setEmprestimos([]);
            setMembros([]);
            setLivros([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.bookId || !formData.userId) {
            setError('Selecione um livro e um membro');
            return;
        }

        try {
            await emprestimoService.emprestar(parseInt(formData.bookId), parseInt(formData.userId));
            alert('Empréstimo realizado com sucesso!');
            setFormData({ bookId: '', userId: '' });
            fetchData();
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data || 'Erro ao realizar empréstimo';
            setError(typeof errorMsg === 'string' ? errorMsg : 'Erro ao realizar empréstimo');
            console.error(err);
        }
    };

    const handleDevolucao = async (loanId) => {
        if (window.confirm('Confirmar a devolução deste livro?')) {
            try {
                await emprestimoService.devolver(loanId);
                alert('Devolução registrada com sucesso!');
                fetchData();
            } catch (err) {
                setError('Erro ao registrar devolução');
                console.error(err);
            }
        }
    };

    const livrosDisponiveis = livros.filter(l => l.quantidadeDisponivel > 0);

    // Encontrar nome do membro e livro
    const getMemberName = (emprestimo) => {
        // Pode vir como user object ou userId, tenta os dois
        if (emprestimo.user && emprestimo.user.nome) {
            return emprestimo.user.nome;
        }
        const member = membros.find(m => m.id === emprestimo.userId);
        return member ? member.nome : 'Desconhecido';
    };

    const getBookTitle = (emprestimo) => {
        // Pode vir como book object ou bookId, tenta os dois
        if (emprestimo.book && emprestimo.book.titulo) {
            return emprestimo.book.titulo;
        }
        const book = livros.find(b => b.id === emprestimo.bookId);
        return book ? book.titulo : 'Desconhecido';
    };

    return (
        <div>
            <Navbar onLogout={onLogout} />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1>🔗 Gestão de Empréstimos</h1>

                {error && <div style={{ color: 'white', marginBottom: '20px', padding: '15px', background: '#dc3545', borderRadius: '4px' }}>❌ {error}</div>}

                {/* Formulário de Empréstimo */}
                <div style={{ background: '#e9f7ff', padding: '20px', marginBottom: '30px', borderRadius: '8px', border: '1px solid #0099ff' }}>
                    <h3>Realizar Novo Empréstimo (RF05)</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'flex-end' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Membro:</label>
                            <select 
                                name="userId" 
                                value={formData.userId}
                                onChange={handleInputChange}
                                required 
                                style={{ padding: '8px', width: '100%', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}>
                                <option value="">-- Selecione o Membro --</option>
                                {membros.map(m => (
                                    <option key={m.id} value={m.id}>{m.nome}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Livro:</label>
                            <select 
                                name="bookId" 
                                value={formData.bookId}
                                onChange={handleInputChange}
                                required 
                                style={{ padding: '8px', width: '100%', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}>
                                <option value="">-- Selecione o Livro --</option>
                                {livrosDisponiveis.map(l => (
                                    <option key={l.id} value={l.id}>
                                        {l.titulo} ({l.quantidadeDisponivel} disp.)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" style={{ padding: '8px 20px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
                            ➕ Confirmar
                        </button>
                    </form>
                </div>

                {/* Filtro de Status */}
                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => setFilterStatus('todos')}
                        style={{ 
                            padding: '8px 15px',
                            background: filterStatus === 'todos' ? '#007bff' : '#ddd',
                            color: filterStatus === 'todos' ? 'white' : '#333',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            fontWeight: 'bold'
                        }}>
                        📋 Todos ({emprestimos.length})
                    </button>
                    <button 
                        onClick={() => setFilterStatus('ativos')}
                        style={{ 
                            padding: '8px 15px',
                            background: filterStatus === 'ativos' ? '#ffc107' : '#ddd',
                            color: filterStatus === 'ativos' ? '#333' : '#333',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            fontWeight: 'bold'
                        }}>
                        ⏳ Ativos ({emprestimos.filter(e => !e.returned).length})
                    </button>
                    <button 
                        onClick={() => setFilterStatus('devolvidos')}
                        style={{ 
                            padding: '8px 15px',
                            background: filterStatus === 'devolvidos' ? '#28a745' : '#ddd',
                            color: filterStatus === 'devolvidos' ? 'white' : '#333',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            fontWeight: 'bold'
                        }}>
                        ✅ Devolvidos ({emprestimos.filter(e => e.returned).length})
                    </button>
                </div>

                {/* Lista de Empréstimos */}
                <h2>Empréstimos ({emprestimos.length})</h2>
                {loading && <p>⏳ Carregando...</p>}
                {!loading && emprestimos.length === 0 && <p>Nenhum empréstimo {filterStatus === 'ativos' ? 'ativo' : filterStatus === 'devolvidos' ? 'devolvido' : 'registrado'}</p>}

                {!loading && emprestimos.length > 0 && (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#ffc107', color: '#333' }}>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Membro</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Livro</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Data Empréstimo</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Data Devolução</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Status</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emprestimos.map(e => (
                                    <tr key={e.id} style={{ borderBottom: '1px solid #ddd', background: e.returned ? '#f0f0f0' : 'white' }}>
                                        <td style={{ padding: '10px' }}>#{e.id}</td>
                                        <td style={{ padding: '10px' }}>{getMemberName(e)}</td>
                                        <td style={{ padding: '10px' }}>{getBookTitle(e)}</td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>{e.loanDate || 'N/A'}</td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>{e.returnDate || '-'}</td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            <span style={{
                                                backgroundColor: e.returned ? '#28a745' : '#ffc107',
                                                color: e.returned ? 'white' : '#333',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontWeight: 'bold'
                                            }}>
                                                {e.returned ? '✅ Devolvido' : '⏳ Ativo'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            {!e.returned ? (
                                                <button 
                                                    onClick={() => handleDevolucao(e.id)}
                                                    style={{ padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
                                                    📖 Devolver
                                                </button>
                                            ) : (
                                                <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓ Concluído</span>
                                            )}
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

export default EmprestimosPage;