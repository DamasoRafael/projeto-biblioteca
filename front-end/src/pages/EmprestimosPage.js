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
    const [filterStatus, setFilterStatus] = useState('todos');
    const [editingLoanId, setEditingLoanId] = useState(null);
    const [editFormData, setEditFormData] = useState({ bookId: '', userId: '' });
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        // ✅ CORREÇÃO: Usar 'user_role' com underscore (consistente com Login.js)
        const role = localStorage.getItem('user_role');
        console.log('🔍 Role carregada do localStorage:', role);
        setUserRole(role);
        fetchData();
    }, [filterStatus]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [empRes, membRes, livRes] = await Promise.all([
                emprestimoService.listar(),
                membroService.listar(),
                livroService.listar(0, 100)
            ]);

            let emprestimoData = empRes.data || [];
            if (!Array.isArray(emprestimoData)) {
                emprestimoData = [];
            }

            if (filterStatus === 'ativos') {
                emprestimoData = emprestimoData.filter(e => !e.returned);
            } else if (filterStatus === 'devolvidos') {
                emprestimoData = emprestimoData.filter(e => e.returned);
            }

            setEmprestimos(emprestimoData);

            const membroData = Array.isArray(membRes.data) ? membRes.data : [];
            setMembros(membroData);

            const livrosData = livRes.data.content || livRes.data;
            setLivros(Array.isArray(livrosData) ? livrosData : []);
        } catch (err) {
            setError('Erro ao carregar dados');
            console.error('❌ Erro ao buscar dados:', err);
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
            alert('✅ Empréstimo realizado com sucesso!');
            setFormData({ bookId: '', userId: '' });
            fetchData();
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data || 'Erro ao realizar empréstimo';
            setError(typeof errorMsg === 'string' ? errorMsg : 'Erro ao realizar empréstimo');
            console.error('❌ Erro ao emprestar:', err);
        }
    };

    const handleDevolucao = async (loanId) => {
        if (window.confirm('Confirmar a devolução deste livro?')) {
            try {
                await emprestimoService.devolver(loanId);
                alert('✅ Devolução registrada com sucesso!');
                fetchData();
            } catch (err) {
                setError('Erro ao registrar devolução');
                console.error('❌ Erro ao devolver:', err);
            }
        }
    };

    const handleEdit = (emprestimo) => {
        console.log('✏️ Editando empréstimo:', emprestimo);
        console.log('👤 Role do usuário:', userRole);
        
        setEditingLoanId(emprestimo.id);
        setEditFormData({
            bookId: emprestimo.book?.id || emprestimo.bookId || '',
            userId: emprestimo.user?.id || emprestimo.userId || ''
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!editFormData.bookId || !editFormData.userId) {
            setError('Selecione um livro e um membro');
            return;
        }

        console.log('📤 Enviando atualização:', {
            loanId: editingLoanId,
            bookId: parseInt(editFormData.bookId),
            userId: parseInt(editFormData.userId)
        });

        try {
            await emprestimoService.atualizar(
                editingLoanId, 
                parseInt(editFormData.bookId), 
                parseInt(editFormData.userId)
            );
            alert('✅ Empréstimo atualizado com sucesso!');
            setEditingLoanId(null);
            setEditFormData({ bookId: '', userId: '' });
            fetchData();
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data || 'Erro ao atualizar empréstimo';
            setError(typeof errorMsg === 'string' ? errorMsg : 'Erro ao atualizar empréstimo');
            console.error('❌ Erro ao atualizar:', err);
            console.error('📄 Detalhes do erro:', err.response?.data);
        }
    };

    const handleDelete = async (loanId) => {
        if (window.confirm('Tem certeza que deseja deletar este empréstimo? O livro será liberado.')) {
            try {
                await emprestimoService.deletar(loanId);
                alert('✅ Empréstimo deletado com sucesso!');
                fetchData();
            } catch (err) {
                const errorMsg = err.response?.data?.message || err.response?.data || 'Erro ao deletar empréstimo';
                setError(typeof errorMsg === 'string' ? errorMsg : 'Erro ao deletar empréstimo');
                console.error('❌ Erro ao deletar:', err);
            }
        }
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const livrosDisponiveis = livros.filter(l => l.quantidadeDisponivel > 0);

    const getMemberName = (emprestimo) => {
        if (emprestimo.user && emprestimo.user.nome) {
            return emprestimo.user.nome;
        }
        const member = membros.find(m => m.id === emprestimo.userId);
        return member ? member.nome : 'Desconhecido';
    };

    const getBookTitle = (emprestimo) => {
        if (emprestimo.book && emprestimo.book.titulo) {
            return emprestimo.book.titulo;
        }
        const book = livros.find(b => b.id === emprestimo.bookId);
        return book ? book.titulo : 'Desconhecido';
    };

    // ✅ CORREÇÃO: Verificação mais robusta de permissões
    const isBibliotecario = userRole === 'BIBLIOTECARIO';

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
                        📋 Todos
                    </button>
                    <button 
                        onClick={() => setFilterStatus('ativos')}
                        style={{ 
                            padding: '8px 15px',
                            background: filterStatus === 'ativos' ? '#ffc107' : '#ddd',
                            color: '#333',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            fontWeight: 'bold'
                        }}>
                        ⏳ Ativos
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
                        ✅ Devolvidos
                    </button>
                </div>

                {/* Lista de Empréstimos */}
                <h2>Empréstimos ({emprestimos.length})</h2>
                {loading && <p>⏳ Carregando...</p>}
                {!loading && emprestimos.length === 0 && <p>Nenhum empréstimo encontrado</p>}

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
                                        <td style={{ padding: '10px', textAlign: 'center', display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                            {!e.returned ? (
                                                <>
                                                    <button 
                                                        onClick={() => handleDevolucao(e.id)}
                                                        style={{ 
                                                            padding: '6px 12px', 
                                                            background: isBibliotecario ? '#28a745' : '#ccc', 
                                                            color: 'white', 
                                                            border: 'none', 
                                                            cursor: isBibliotecario ? 'pointer' : 'not-allowed', 
                                                            borderRadius: '4px', 
                                                            fontWeight: 'bold',
                                                            opacity: isBibliotecario ? 1 : 0.5
                                                        }}
                                                        disabled={!isBibliotecario}>
                                                        📖 Devolver
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEdit(e)}
                                                        style={{ 
                                                            padding: '6px 12px', 
                                                            background: isBibliotecario ? '#0099ff' : '#ccc', 
                                                            color: 'white', 
                                                            border: 'none', 
                                                            cursor: isBibliotecario ? 'pointer' : 'not-allowed', 
                                                            borderRadius: '4px', 
                                                            fontWeight: 'bold',
                                                            opacity: isBibliotecario ? 1 : 0.5
                                                        }}
                                                        disabled={!isBibliotecario}>
                                                        ✏️ Editar
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(e.id)}
                                                        style={{ 
                                                            padding: '6px 12px', 
                                                            background: isBibliotecario ? '#dc3545' : '#ccc', 
                                                            color: 'white', 
                                                            border: 'none', 
                                                            cursor: isBibliotecario ? 'pointer' : 'not-allowed', 
                                                            borderRadius: '4px', 
                                                            fontWeight: 'bold',
                                                            opacity: isBibliotecario ? 1 : 0.5
                                                        }}
                                                        disabled={!isBibliotecario}>
                                                        🗑️ Deletar
                                                    </button>
                                                </>
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

                {/* Modal de Edição */}
                {editingLoanId && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '30px',
                            borderRadius: '8px',
                            maxWidth: '400px',
                            width: '90%',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                        }}>
                            <h2>✏️ Editar Empréstimo #{editingLoanId}</h2>
                            <form onSubmit={handleEditSubmit}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Membro:</label>
                                    <select 
                                        name="userId" 
                                        value={editFormData.userId}
                                        onChange={handleEditInputChange}
                                        required 
                                        style={{ padding: '8px', width: '100%', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}>
                                        <option value="">-- Selecione o Membro --</option>
                                        {membros.map(m => (
                                            <option key={m.id} value={m.id}>{m.nome}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Livro:</label>
                                    <select 
                                        name="bookId" 
                                        value={editFormData.bookId}
                                        onChange={handleEditInputChange}
                                        required 
                                        style={{ padding: '8px', width: '100%', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}>
                                        <option value="">-- Selecione o Livro --</option>
                                        {livros.map(l => (
                                            <option key={l.id} value={l.id}>
                                                {l.titulo} ({l.quantidadeDisponivel} disp.)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setEditingLoanId(null);
                                            setEditFormData({ bookId: '', userId: '' });
                                        }}
                                        style={{ padding: '8px 20px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
                                        ❌ Cancelar
                                    </button>
                                    <button 
                                        type="submit"
                                        style={{ padding: '8px 20px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
                                        ✅ Salvar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmprestimosPage;