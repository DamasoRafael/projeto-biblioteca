import React, { useState } from 'react';
// Não precisa do axios aqui, pois o login
// (na Sprint 2) será mais complexo.
// Por agora, apenas simula a navegação.

// A prop "onLoginSuccess" será a função do App.js
// que "deixa" entrar.
function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Para a Sprint 1, não valida o login,
    // apenas simula o sucesso para navegar.
    console.log("Tentativa de login com:", email);
    onLoginSuccess(); // Chama a função do App.js para "trocar de tela"
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
            required
          />
        </div>
        <div style={{ margin: '10px' }}>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;