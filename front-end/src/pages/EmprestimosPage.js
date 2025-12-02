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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [empRes, membRes, livRes] = await Promise.all([
                emprestimoService.listar(),
                membroService.listar(),
                livroService.listar(0, 100)
            ]);
            setEmprestimos(Array.isArray(empRes.data) ? empRes.data : []);
            setMembros(Array.isArray(membRes.data) ? membRes.data : []);
            
            const livrosData = livRes.data.content || livRes.data;
            setLivros(Array.isArray(livrosData) ? livrosData : []);
        } catch (err) {
            setError('Erro ao carregar dados');
            console.error(err);
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
            setError(err.response?.data || 'Erro ao realizar empréstimo');
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

    return (
        <div>
            <Navbar onLogout={onLogout} />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1>🔗 Gestão de Empréstimos</h1>

                {error && <div style={{ color: 'red', marginBottom: '20px' }}>❌ {error}</div>}

                {/* Formulário de Empréstimo */}
                <div style={{ background: '#e9f7ff', padding: '20px', marginBottom: '30px', borderRadius: '8px' }}>
                    <h3>Realizar Novo Empréstimo (RF05)</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px' }}>
                        <select 
                            name="userId" 
                            value={formData.userId}
                            onChange={handleInputChange}
                            required 
                            style={{ padding: '8px' }}>
                            <option value="">-- Selecione o Membro --</option>
                            {membros.map(m => (
                                <option key={m.id} value={m.id}>{m.nome}</option>
                            ))}
                        </select>
                        
                        <select 
                            name="bookId" 
                            value={formData.bookId}
                            onChange={handleInputChange}
                            required 
                            style={{ padding: '8px' }}>
                            <option value="">-- Selecione o Livro --</option>
                            {livrosDisponiveis.map(l => (
                                <option key={l.id} value={l.id}>
                                    {l.titulo} ({l.quantidadeDisponivel} disponível)
                                </option>
                            ))}
                        </select>

                        <button type="submit" style={{ padding: '8px 20px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                            Confirmar
                        </button>
                    </form>
                </div>

                {/* Lista de Empréstimos */}
                <h2>Empréstimos ({emprestimos.length})</h2>
                {loading && <p>⏳ Carregando...</p>}
                {!loading && emprestimos.length === 0 && <p>Nenhum empréstimo registrado</p>}

                {!loading && emprestimos.length > 0 && (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#ffc107', color: '#333' }}>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Membro</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Livro</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Data Empréstimo</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Status</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emprestimos.map(e => (
                                    <tr key={e.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '10px' }}>#{e.id}</td>
                                        <td style={{ padding: '10px' }}>{e.user?.nome || 'N/A'}</td>
                                        <td style={{ padding: '10px' }}>{e.book?.titulo || 'N/A'}</td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>{e.loanDate}</td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            <span style={{
                                                backgroundColor: e.returned ? '#28a745' : '#ffc107',
                                                color: '#333',
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
                                                    style={{ padding: '5px 10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                                                    Devolver
                                                </button>
                                            ) : (
                                                <span style={{ color: '#28a745' }}>Concluído</span>
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