import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { emprestimoService } from '../services/api';

function HistoricoPage() {
    // Pega o ID do Membro logado da URL (ex: /historico/1)
    const { membroId } = useParams(); 
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchHistorico(); }, [membroId]); 

    // --- RF12: CONSULTAR HISTÓRICO PESSOAL ---
    const fetchHistorico = async () => {
        setLoading(true);
        try {
            // Chama o serviço de listar, passando o ID para filtrar no Backend
            const response = await emprestimoService.listar(membroId); 
            setHistorico(response.data);
        } catch (error) {
            console.error("Erro ao buscar histórico:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
            <Link to="/dashboard">← Voltar</Link>
            <h1 style={{ color: '#007bff' }}>Meu Histórico de Empréstimos (RF12)</h1>
            <p>Visualizando histórico para Membro ID: <strong>{membroId}</strong></p>

            {loading ? (
                <p>Carregando histórico...</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            <th style={tableHeaderStyle}>Livro</th>
                            <th style={tableHeaderStyle}>Emprestado em</th>
                            <th style={tableHeaderStyle}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historico.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Nenhum empréstimo encontrado.</td></tr>
                        ) : (
                            historico.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={tableCellStyle}>{item.livro}</td>
                                    <td style={tableCellStyle}>{item.dataEmprestimo}</td>
                                    <td style={tableCellStyle}>
                                        <span style={{ color: item.status === 'Ativo' ? 'orange' : 'green' }}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}


const tableHeaderStyle = { padding: '10px', textAlign: 'left' };
const tableCellStyle = { padding: '10px', borderRight: '1px solid #eee' };

export default HistoricoPage;