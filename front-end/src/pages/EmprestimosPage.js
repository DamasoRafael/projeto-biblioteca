import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { emprestimoService, livroService, membroService } from '../services/api'; // Usando serviço REAL

function EmprestimosPage() {
    const [emprestimos, setEmprestimos] = useState([]);
    const [membros, setMembros] = useState([]);
    const [livros, setLivros] = useState([]);
    const [formData, setFormData] = useState({ membroId: '', livroId: '' });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            // Buscamos todos os dados necessários para popular os selects
            const [empRes, membRes, livRes] = await Promise.all([
                emprestimoService.listar(),
                membroService.listar(),
                livroService.listar()
            ]);
            setEmprestimos(empRes.data);
            setMembros(membRes.data);
            setLivros(livRes.data);
        } catch (error) { console.error("Erro ao carregar dados:", error); }
    };

    // --- RF05: REALIZAR EMPRÉSTIMO ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { membroId, livroId } = formData;
        
        try {
            // Chama a API com a lógica de negócio no Backend
            await emprestimoService.salvar({ membroId: parseInt(membroId), livroId: parseInt(livroId) });
            alert("Empréstimo realizado com sucesso! (RF05)");
            fetchData();
        } catch (error) {
             if (error.response && error.response.status === 409) {
                 // Trata o erro 409 (Conflito) vindo do Backend (RN-04/RN-05)
                 alert("Bloqueado: Membro possui pendências ou Livro indisponível.");
             } else {
                 alert("Erro ao realizar empréstimo.");
             }
        }
    };

    // --- RF07: REGISTRAR DEVOLUÇÃO ---
    const handleDevolucao = async (id) => {
        if (window.confirm("Confirmar a devolução? (RF07)")) {
            try {
                await emprestimoService.registrarDevolucao(id);
                alert("Devolução registrada com sucesso! (RF07)");
                fetchData();
            } catch (error) {
                 alert("Erro ao registrar devolução. Verifique o console.");
            }
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1000px', margin: '0 auto' }}>
            <Link to="/dashboard">← Voltar</Link>
            <h1>Gestão de Empréstimos (I_GestaoEmprestimos)</h1>

            {/* Formulário de Empréstimo (RF05) */}
            <div style={{ background: '#e9f7ff', padding: '20px', marginBottom: '30px', borderRadius: '8px' }}>
                <h3>Realizar Novo Empréstimo (RF05)</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
                    
                    {/* Seleção do Membro */}
                    <select name="membroId" onChange={(e) => setFormData({...formData, membroId: e.target.value})} style={{ padding: '8px', flex: 1 }} required>
                        <option value="">-- Selecione o Membro --</option>
                        {membros.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                    </select>
                    
                    {/* Seleção do Livro */}
                    <select name="livroId" onChange={(e) => setFormData({...formData, livroId: e.target.value})} style={{ padding: '8px', flex: 1 }} required>
                        <option value="">-- Selecione o Livro --</option>
                        {livros.map(l => <option key={l.id} value={l.id}>{l.titulo}</option>)}
                    </select>

                    <button type="submit" style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                        Confirmar Empréstimo
                    </button>
                </form>
            </div>

            {/* Lista de Empréstimos (RF06, RF07) */}
            <h2>Empréstimos Ativos e Histórico ({emprestimos.length})</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#333', color: 'white' }}>
                        <th style={tableHeaderStyle}>Membro</th>
                        <th style={tableHeaderStyle}>Livro</th>
                        <th style={tableHeaderStyle}>Empréstimo</th>
                        <th style={tableHeaderStyle}>Status</th>
                        <th style={tableHeaderStyle}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {emprestimos.map(e => (
                        <tr key={e.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={tableCellStyle}>{e.membro}</td>
                            <td style={tableCellStyle}>{e.livro}</td>
                            <td style={tableCellStyle}>{e.dataEmprestimo}</td>
                            <td style={tableCellStyle}>
                                <strong style={{ color: e.status === 'Ativo' ? 'orange' : 'green' }}>{e.status}</strong>
                            </td>
                            <td style={tableCellStyle}>
                                {e.status === 'Ativo' ? (
                                    <button onClick={() => handleDevolucao(e.id)} style={actionButtonStyle}>
                                        Devolver (RF07)
                                    </button>
                                ) : (
                                    <span>Devolvido</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const tableHeaderStyle = { padding: '10px', textAlign: 'left' };
const tableCellStyle = { padding: '10px', borderRight: '1px solid #eee' };
const actionButtonStyle = { padding: '5px 10px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px' };

export default EmprestimosPage;