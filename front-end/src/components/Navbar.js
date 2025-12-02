import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Usuário';

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const navStyle = {
    backgroundColor: '#007bff',
    padding: '15px',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #0056b3'
  };

  const linksStyle = {
    display: 'flex',
    gap: '20px',
    listStyle: 'none',
    margin: 0,
    padding: 0
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    cursor: 'pointer',
    padding: '5px 10px',
    borderRadius: '4px',
    transition: 'background 0.3s'
  };

  return (
    <nav style={navStyle}>
      <h2 style={{ margin: 0 }}>📚 Biblioteca</h2>
      <ul style={linksStyle}>
        <li><Link to="/dashboard" style={linkStyle}>Dashboard</Link></li>
        <li><Link to="/livros" style={linkStyle}>Livros</Link></li>
        <li><Link to="/membros" style={linkStyle}>Membros</Link></li>
        <li><Link to="/emprestimos" style={linkStyle}>Empréstimos</Link></li>
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span>👤 {userName}</span>
        <button 
          onClick={handleLogout}
          style={{
            padding: '8px 15px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
          Sair
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
