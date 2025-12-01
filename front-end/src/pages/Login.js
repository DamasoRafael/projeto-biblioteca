import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  // Preenchimento automático para agilizar o teste
  const [email, setEmail] = useState('admin@biblioteca.com'); 
  const [password, setPassword] = useState('123456');
  
  // Hook necessário para navegação em componentes
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    // 1. OBRIGATÓRIO: Impede o refresh da página
    e.preventDefault(); 
    
    // --- PASSO DE DEBUG ---
    console.log("1. FUNÇÃO HANDLE SUBMIT EXECUTADA COM SUCESSO."); 
    
    // 2. Chama a função de sucesso no App.js para mudar o estado de autenticação
    onLoginSuccess(); 
    
    // 3. Navega para o Dashboard
    navigate('/dashboard'); 
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>Sistema de Biblioteca</h1>
      <h2>Login (RF09)</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ margin: '10px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ margin: '10px' }}>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
            Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;