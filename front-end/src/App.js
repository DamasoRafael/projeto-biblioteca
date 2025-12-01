import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Componentes das Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LivrosPage from './pages/LivrosPage';
import MembrosPage from './pages/MembrosPage';
import EmprestimosPage from './pages/EmprestimosPage';
import HistoricoPage from './pages/HistoricoPage';

// Componente que protege as rotas
const ProtectedRoute = ({ element: Element }) => {
    // Busca o estado de autenticação (simulado)
    const [isLoggedIn] = useState(true); // Manter true para teste de protótipo (você pode ajustar a lógica de state para o seu App.js)
    return isLoggedIn ? <Element /> : <Navigate to="/" />;
};

function App() {
  // ATENÇÃO: A LÓGICA DEVE FICAR AQUI, MAS VAMOS SIMPLIFICAR O FLUXO DE PROPS
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true); // A função que Login.js precisa
  };

  return (
    <Router>
      <Routes>
        
        {/* 1. Rota de Login (Passa a função handleLogin como prop) */}
        <Route 
            path="/" 
            element={<Login onLoginSuccess={handleLogin} />} // <-- A função onLoginSuccess é passada AQUI
        />
        
        {/* 2. Rotas Protegidas (Exemplo: Se não quiser usar o ProtectedRoute complexo, pode simplificar assim): */}
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/livros" element={<LivrosPage />} />
        <Route path="/membros" element={<MembrosPage />} />
        <Route path="/emprestimos" element={<EmprestimosPage />} />
        <Route path="/historico/:membroId" element={<HistoricoPage />} />

        {/* Redirecionamento 404 (Opcional) */}
        <Route path="*" element={<h2>404 Página Não Encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;