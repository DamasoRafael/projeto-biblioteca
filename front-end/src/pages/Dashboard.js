import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { livroService, emprestimoService, membroService } from '../services/api';

function Dashboard({ onLogout }) {
    const [stats, setStats] = useState({
        totalLivros: 0,
        totalMembros: 0,
        totalEmprestimos: 0,
        emprestimosAtivos: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        carregarEstatisticas();
    }, []);

    const carregarEstatisticas = async () => {
        try {
            const [livrosRes, membrosRes, emprestimosRes] = await Promise.all([
                livroService.listar(0, 1),
                membroService.listar(),
                emprestimoService.listar()
            ]);

            setStats({
                totalLivros: livrosRes.data.totalElements || 0,
                totalMembros: membrosRes.data.length || 0,
                totalEmprestimos: emprestimosRes.data.length || 0,
                emprestimosAtivos: emprestimosRes.data.filter(e => !e.returned).length || 0
            });
        } catch (err) {
            setError('Erro ao carregar estatísticas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar onLogout={onLogout} />
            <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ color: '#333', marginBottom: '30px' }}>📊 Dashboard Principal</h1>

                {error && <div style={{ color: 'red', marginBottom: '20px' }}>❌ {error}</div>}

                {/* Cards de Estatísticas */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    <StatCard label="Livros no Acervo" valor={stats.totalLivros} cor="#007bff" />
                    <StatCard label="Membros Registrados" valor={stats.totalMembros} cor="#28a745" />
                    <StatCard label="Empréstimos Ativos" valor={stats.emprestimosAtivos} cor="#ffc107" />
                    <StatCard label="Total de Empréstimos" valor={stats.totalEmprestimos} cor="#17a2b8" />
                </div>

                {/* Módulos de Navegação */}
                <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>🔧 Módulos de Gerenciamento</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    <ModuleCard 
                        title="📚 Gestão de Acervo" 
                        description="Adicione, edite e remova livros do acervo"
                        rota="/livros"
                        cor="#007bff"
                    />
                    <ModuleCard 
                        title="👥 Gestão de Membros" 
                        description="Gerencie os membros da biblioteca"
                        rota="/membros"
                        cor="#28a745"
                    />
                    <ModuleCard 
                        title="🔗 Gestão de Empréstimos" 
                        description="Crie e acompanhe empréstimos de livros"
                        rota="/emprestimos"
                        cor="#ffc107"
                    />
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, valor, cor }) {
    return (
        <div style={{
            background: cor,
            color: 'white',
            padding: '30px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>{label}</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{valor}</div>
        </div>
    );
}

function ModuleCard({ title, description, rota, cor }) {
    return (
        <Link to={rota} style={{ textDecoration: 'none' }}>
            <div style={{
                border: `2px solid ${cor}`,
                padding: '25px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                backgroundColor: '#f9f9f9',
                ':hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 8px 16px rgba(0,0,0,0.1)`
                }
            }}
            onMouseEnter={(e) => e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'}
            onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
            >
                <h3 style={{ color: cor, margin: '0 0 10px 0' }}>{title}</h3>
                <p style={{ color: '#666', margin: 0 }}>{description}</p>
            </div>
        </Link>
    );
}

export default Dashboard;