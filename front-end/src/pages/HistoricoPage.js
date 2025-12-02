import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { emprestimoService } from '../services/api';

function HistoricoPage({ onLogout }) {
    const { membroId } = useParams();
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchHistorico();
    }, [membroId]);

    const fetchHistorico = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await emprestimoService.listarPorUsuario(membroId);
            setHistorico(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError('Erro ao buscar histórico');
            console.error(err);
            setHistorico([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar onLogout={onLogout} />
            <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                <h1>📝 Histórico de Empréstimos (RF12)</h1>
                <p style={{ color: '#666' }}>Visualizando histórico para Membro ID: <strong>#{membroId}</strong></p>

                {error && <div style={{ color: 'red', marginBottom: '20px' }}>❌ {error}</div>}

                {loading && <p>⏳ Carregando histórico...</p>}

                {!loading && historico.length === 0 && <p>Nenhum empréstimo encontrado para este membro</p>}

                {!loading && historico.length > 0 && (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#17a2b8', color: 'white' }}>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Livro</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Data do Empréstimo</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Data da Devolução</th>
                                    <th style={{ padding: '10px', textAlign: 'center' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historico.map(item => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '10px' }}>#{item.id}</td>
                                        <td style={{ padding: '10px' }}>{item.book?.titulo || 'N/A'}</td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>{item.loanDate}</td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>{item.returnDate || '-'}</td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            <span style={{
                                                backgroundColor: item.returned ? '#28a745' : '#ffc107',
                                                color: '#333',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontWeight: 'bold'
                                            }}>
                                                {item.returned ? '✅ Devolvido' : '⏳ Ativo'}
                                            </span>
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

export default HistoricoPage;