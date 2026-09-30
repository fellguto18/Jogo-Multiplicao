import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('aluno');
  const navigate = useNavigate();

  const lidarComRegisto = async (e) => {
    e.preventDefault();

    try {
      const resposta = await fetch('http://localhost:5000/api/auth/registar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, tipo })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Conta criada com sucesso!');
        navigate('/'); // Redireciona para a página de Login
      } else {
        alert(dados.erro || 'Erro ao criar conta.');
      }
    } catch (erro) {
      console.error(erro);
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div style={estilos.container}>
      <h2>Criar Nova Conta</h2>
      <form onSubmit={lidarComRegisto} style={estilos.formulario}>
        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={estilos.input}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={estilos.input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          style={estilos.input}
        />
        
        <select 
          value={tipo} 
          onChange={(e) => setTipo(e.target.value)}
          style={estilos.input}
        >
          <option value="aluno">Aluno</option>
          <option value="educador">Educador / Psicopedagogo</option>
        </select>

        <button type="submit" style={estilos.botao}>Registar</button>
      </form>

      <p style={{ marginTop: '15px' }}>
        Já tem uma conta? <Link to="/" style={{ color: '#2196F3' }}>Voltar ao Login</Link>
      </p>
    </div>
  );
}

const estilos = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10vh', fontFamily: 'sans-serif' },
  formulario: { display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' },
  input: { padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' },
  botao: { padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};