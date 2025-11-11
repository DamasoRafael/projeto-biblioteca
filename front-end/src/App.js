import React, { useState } from 'react';
import LivrosCRUD from './LivrosCRUD'; // A tela de CRUD 
import Login from './Login';           // A nova tela de Login
import './App.css';

function App() {
  // O "mínimo" de navegação: um state para saber se o utilizador está logado.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Esta função será chamada pelo componente Login
  // quando o utilizador clicar em "Entrar".
  const handleLogin = () => {
    setIsLoggedIn(true); // Muda o state, o que vai mudar a tela
  };

  return (
    <div className="App">
      {/* Isto é um 'if' (ternário):
          Se 'isLoggedIn' for true, mostra a tela de CRUD.
          Se for false, mostra a tela de Login.
      */}
      {isLoggedIn ? (
        <LivrosCRUD />
      ) : (
        <Login onLoginSuccess={handleLogin} />
      )}
    </div>
  );
}

export default App;