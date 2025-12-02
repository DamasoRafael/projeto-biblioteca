import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('joao.silva@teste.com');
  const [password, setPassword] = useState('senha123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'MEMBRO'
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
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

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError('');

    try {
      // Chama o endpoint de registro
      await authService.register(
        registerData.nome,
        registerData.email,
        registerData.senha,
        registerData.role
      );
      
      alert('Usuário cadastrado com sucesso! Faça login com suas credenciais.');
      setShowRegister(false);
      setRegisterData({ nome: '', email: '', senha: '', role: 'MEMBRO' });
    } catch (err) {
      setRegisterError(err.response?.data?.message || 'Erro ao cadastrar usuário. Verifique os dados.');
      console.error('Erro ao registrar:', err);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial', textAlign: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <h1>📚 Sistema de Biblioteca</h1>
        
        {!showRegister ? (
          <>
            <h2>Login (RF09)</h2>
            
            {error && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', background: '#ffe0e0', borderRadius: '4px' }}>❌ {error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div style={{ margin: '10px' }}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
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
                  style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
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
                  marginTop: '10px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}>
                {loading ? 'Carregando...' : 'Entrar'}
              </button>
            </form>

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
              <p>📝 Usuários padrão para teste:</p>
              <p><strong>Bibliotecário:</strong></p>
              <p>Email: joao.silva@teste.com</p>
              <p>Senha: senha123</p>
              
              <p style={{ marginTop: '15px' }}><strong>Membro:</strong></p>
              <p>Email: maria.santos@teste.com</p>
              <p>Senha: senha123</p>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => setShowRegister(true)}
                style={{
                  padding: '10px 20px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  width: '100%'
                }}>
                + Cadastrar Novo Usuário
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>Cadastrar Novo Usuário</h2>
            
            {registerError && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', background: '#ffe0e0', borderRadius: '4px' }}>❌ {registerError}</div>}
            
            <form onSubmit={handleRegisterSubmit}>
              <div style={{ margin: '10px' }}>
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome Completo"
                  value={registerData.nome}
                  onChange={handleRegisterChange}
                  disabled={registerLoading}
                  required
                  style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ margin: '10px' }}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  disabled={registerLoading}
                  required
                  style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ margin: '10px' }}>
                <input
                  type="password"
                  name="senha"
                  placeholder="Senha"
                  value={registerData.senha}
                  onChange={handleRegisterChange}
                  disabled={registerLoading}
                  required
                  style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ margin: '10px' }}>
                <select
                  name="role"
                  value={registerData.role}
                  onChange={handleRegisterChange}
                  disabled={registerLoading}
                  style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="MEMBRO">Membro</option>
                  <option value="BIBLIOTECARIO">Bibliotecário</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button 
                  type="submit" 
                  disabled={registerLoading}
                  style={{ 
                    padding: '10px 20px', 
                    background: registerLoading ? '#ccc' : '#28a745', 
                    color: 'white', 
                    border: 'none', 
                    cursor: registerLoading ? 'not-allowed' : 'pointer',
                    flex: 1,
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}>
                  {registerLoading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowRegister(false)}
                  style={{ 
                    padding: '10px 20px', 
                    background: '#6c757d', 
                    color: 'white', 
                    border: 'none', 
                    cursor: 'pointer',
                    flex: 1,
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}>
                  Voltar
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;