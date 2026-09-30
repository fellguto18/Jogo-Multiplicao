import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PainelProf() {
  const [relatorios, setRelatorios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // ID do aluno a consultar (usaremos o ID 1 por padrão para testes)
  const studentId = 1;

  useEffect(() => {
    async function carregarDados() {
      try {
        const resposta = await fetch(`http://localhost:5000/api/progresso/relatorio/${studentId}`);
        const dados = await resposta.json();

        if (resposta.ok) {
          setRelatorios(dados);
        } else {
          setErro(dados.mensagem || 'Nenhum dado encontrado.');
        }
      } catch (err) {
        console.error(err);
        setErro('Erro ao ligar ao servidor.');
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [studentId]);

  return (
    <div style={estilos.container}>
      <header style={estilos.header}>
        <h1>📊 Painel Psicopedagógico</h1>
        <Link to="/jogo" style={estilos.linkVoltar}>← Voltar ao Jogo</Link>
      </header>

      {carregando && <p>A carregar relatórios do aluno...</p>}
      {erro && <p style={estilos.erro}>{erro}</p>}

      {!carregando && !erro && relatorios.length === 0 && (
        <p>Ainda não há partidas registadas para este aluno.</p>
      )}

      {!carregando && relatorios.length > 0 && (
        <div style={estilos.grid}>
          {relatorios.map((sessao) => (
            <div key={sessao.id} style={estilos.cartao}>
              <h3>Sessão #{sessao.id} - Tabuada do {sessao.tabuadaFoco}</h3>
              <p><strong>Data:</strong> {new Date(sessao.dataSessao).toLocaleString()}</p>
              <p><strong>Respostas Corretas:</strong> {sessao.respostasCorretas}</p>
              <p><strong>Tempo Médio:</strong> {sessao.tempoMedioRespostas}s</p>
              <p><strong>Concluída:</strong> {sessao.faseConcluida ? '✅ Sim' : '❌ Não'}</p>
              
              <div style={estilos.caixaErros}>
                <h4>Detalhamento de Erros:</h4>
                {sessao.errosDetalhados && sessao.errosDetalhados.length > 0 ? (
                  <ul>
                    {sessao.errosDetalhados.map((item, idx) => (
                      <li key={idx}>
                        Calculou <strong>{item.operacao}</strong> e respondeu <code>{item.respostaDada}</code>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'green', margin: 0 }}>Nenhum erro registado nesta sessão!</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const estilos = {
  container: { padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  linkVoltar: { textDecoration: 'none', color: '#2196F3', fontWeight: 'bold' },
  erro: { color: 'red', fontWeight: 'bold' },
  grid: { display: 'flex', flexDirection: 'column', gap: '15px' },
  cartao: { border: '1px solid #ccc', borderRadius: '8px', padding: '15px', backgroundColor: '#f9f9f9' },
  caixaErros: { marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #bbb' }
};