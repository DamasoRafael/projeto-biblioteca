import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';       // Mova seu Login.js para a pasta pages
import LivrosPage from './pages/LivrosPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota padrão vai para o Login */}
        <Route path="/" element={<Login />} />
        
        {/* Rota protegida (na Sprint 3 adicionamos segurança real) */}
        <Route path="/livros" element={<LivrosPage />} />
        
        {/* Qualquer outra coisa volta pro login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;