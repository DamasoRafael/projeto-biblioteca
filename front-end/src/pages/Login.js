import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('joao.silva@teste.com');
  const [password, setPassword] = useState('senha123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Chama o endpoint de login
      const response = await authService.login(email, password);
      
      // Salva o token no localStorage
      localStorage.setItem('jwt_token', response.data.token);
      localStorage.setItem('user_id', response.data.userId);
      localStorage.setItem('user_name', response.data.nome);
      localStorage.setItem('user_role', response.data.role);

      // Chama a função de sucesso
      onLoginSuccess();

      // Navega para o dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || 'Erro ao fazer login. Verifique email e senha.');
      console.error('Erro de login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial', textAlign: 'center', maxWidth: '400px', margin: '50px auto' }}>
      <h1>📚 Sistema de Biblioteca</h1>
      <h2>Login (RF09)</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>❌ {error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ margin: '10px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ margin: '10px' }}>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            background: loading ? '#ccc' : '#007bff', 
            color: 'white', 
            border: 'none', 
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
            marginTop: '10px'
          }}>
          {loading ? 'Carregando...' : 'Entrar'}
        </button>
      </form>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>📝 Usuários padrão para teste:</p>
        <p>Email: joao.silva@teste.com</p>
        <p>Senha: senha123</p>
      </div>
    </div>
  );
}

export default Login;