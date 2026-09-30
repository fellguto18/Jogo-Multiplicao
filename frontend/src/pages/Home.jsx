import { useNavigate } from 'react-router-dom';
import FormularioLogin from '../components/FormularioLogin';

export default function Home() {
  const navigate = useNavigate();

  const lidarComLogin = async (email, senha) => {
    try {
      const resposta = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        // Guarda o ID do jogador no navegador para enviar a telemetria depois
        localStorage.setItem('playerId', dados.utilizador.id);
        navigate('/jogo'); // Redireciona para a tela do jogo
      } else {
        alert(dados.erro || 'Erro ao fazer login');
      }
    } catch (erro) {
      console.error(erro);
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div style={estilos.container}>
      <h1>Fuga da Floresta Zumbi</h1>
      <FormularioLogin aoFazerLogin={lidarComLogin} />
    </div>
  );
}

const estilos = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10vh', fontFamily: 'sans-serif' }
};