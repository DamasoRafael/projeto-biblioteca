import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/api';

// Componentes das Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LivrosPage from './pages/LivrosPage';
import MembrosPage from './pages/MembrosPage';
import EmprestimosPage from './pages/EmprestimosPage';
import HistoricoPage from './pages/HistoricoPage';

// Componente que protege as rotas
const ProtectedRoute = ({ element: Element, isLoggedIn }) => {
    return isLoggedIn ? <Element /> : <Navigate to="/" />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verifica se há token válido no localStorage ao carregar
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Rota de Login */}
        <Route 
            path="/" 
            element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLogin} />}
        />
        
        {/* Rotas Protegidas */}
        <Route 
            path="/dashboard" 
            element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route 
            path="/livros" 
            element={isLoggedIn ? <LivrosPage onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route 
            path="/membros" 
            element={isLoggedIn ? <MembrosPage onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route 
            path="/emprestimos" 
            element={isLoggedIn ? <EmprestimosPage onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route 
            path="/historico/:membroId" 
            element={isLoggedIn ? <HistoricoPage onLogout={handleLogout} /> : <Navigate to="/" />}
        />

        {/* Redirecionamento 404 */}
        <Route path="*" element={<h2>404 Página Não Encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;