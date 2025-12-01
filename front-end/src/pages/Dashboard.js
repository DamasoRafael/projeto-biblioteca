import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    // Você pode usar este estado para simular a exibição de diferentes menus
    // para Bibliotecário (true) e Membro (false) em uma versão futura.
    const [isBibliotecario, setIsBibliotecario] = useState(true); 

    const handleLogout = () => {
        // Simulação de logout
        alert("Logout simulado. Voltando para a tela de Login.");
        navigate('/'); 
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ccc', paddingBottom: '10px', marginBottom: '20px' }}>
                <h1 style={{ margin: 0, color: '#333' }}>Dashboard Principal</h1>
                <button 
                    onClick={handleLogout}
                    style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Sair
                </button>
            </header>

            <p style={{ color: '#555', fontSize: '1.1em', marginTop: '20px' }}>Selecione o módulo que deseja gerenciar.</p>
            
            <nav style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
                
                {/* Módulo de Livros (CRUD Simples) */}
                <Link to="/livros" style={linkStyle}>
                    <h3 style={{ margin: 0 }}>📚 Gestão de Acervo (Livros)</h3>
                    <p style={{ margin: '5px 0 0', color: '#007bff' }}>CRUD Simples (RF01-RF04)</p>
                </Link>

                {/* Módulo de Membros */}
                <Link to="/membros" style={linkStyle}>
                    <h3 style={{ margin: 0 }}>👥 Gestão de Membros</h3>
                    <p style={{ margin: '5px 0 0', color: '#007bff' }}>CRUD de Apoio (RF10, RF11)</p>
                </Link>

                {/* Módulo de Empréstimos (CRUD Complexo) */}
                <Link to="/emprestimos" style={linkStyle}>
                    <h3 style={{ margin: 0 }}>🔗 Gestão de Empréstimos</h3>
                    <p style={{ margin: '5px 0 0', color: '#007bff' }}>CRUD Complexo (RF05-RF08)</p>
                </Link>
                
                {/* Histórico do Membro (Usando ID 1 como exemplo) */}
                <Link to="/historico/1" style={{ ...linkStyle, backgroundColor: '#f0f0ff' }}>
                    <h3 style={{ margin: 0, color: '#4CAF50' }}>📝 Meu Histórico (Membro ID 1)</h3>
                    <p style={{ margin: '5px 0 0', color: '#4CAF50' }}>Visualização Membro (RF12)</p>
                </Link>
            </nav>
        </div>
    );
}

const linkStyle = {
    textDecoration: 'none', color: '#333', background: '#fff', border: '1px solid #ddd', padding: '25px', borderRadius: '8px', 
    flex: '1 1 calc(33% - 40px)', textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', transition: 'transform 0.2s',
};

export default Dashboard;