import { useState } from 'react';
import { Link } from 'react-router-dom';
export default function FormularioLogin({ aoFazerLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const submeterFormulario = (e) => {
    e.preventDefault();
    // A função aoFazerLogin será passada pela página pai (Home)
    aoFazerLogin(email, senha);
  };

  return (
    <div style={estilos.caixa}>
      <h2>Entrar na Floresta</h2>
      <form onSubmit={submeterFormulario} style={estilos.formulario}>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={estilos.input}
        />
        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          style={estilos.input}
        />
        <button type="submit" style={estilos.botao}>Jogar</button>
      </form>
      <p style={{ marginTop: '15px', fontSize: '14px' }}>
         <Link to="/registo" style={{ color: '#2196F3' }}>Criar conta</Link>
      </p>
    </div>
  );
}

const estilos = {
  caixa: { border: '2px solid #555', padding: '20px', borderRadius: '10px', textAlign: 'center', width: '300px', margin: '0 auto' },
  formulario: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' },
  input: { padding: '10px', fontSize: '16px' },
  botao: { padding: '10px', backgroundColor: '#555', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }
};