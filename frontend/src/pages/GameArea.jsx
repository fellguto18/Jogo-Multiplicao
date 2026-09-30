import { useState } from 'react';
import { Link } from 'react-router-dom';
import CenarioPhaser from '../components/CenarioPhaser';

export default function GameArea() {
  const [erros, setErros] = useState([]);
  const [respostasCorretas, setRespostasCorretas] = useState(0);
  const [tempoInicio] = useState(Date.now());

  const playerId = localStorage.getItem('playerId') || 1;

  const enviarTelemetria = async (tabuadaFoco, concluiu = false) => {
    const tempoTotalSegundos = Math.max(1, Math.round((Date.now() - tempoInicio) / 1000));
    const totalTentativas = respostasCorretas + erros.length;
    const tempoMedio = totalTentativas > 0 ? (tempoTotalSegundos / totalTentativas).toFixed(1) : 0;

    try {
      await fetch('http://localhost:5000/api/progresso/sessao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: Number(playerId),
          tabuadaFoco: Number(tabuadaFoco),
          respostasCorretas,
          errosDetalhados: erros,
          tempoMedioRespostas: Number(tempoMedio),
          faseConcluida: concluiu
        })
      });
      if (!concluiu) alert('Progresso guardado com sucesso!');
    } catch (err) {
      console.error('Erro ao enviar telemetria:', err);
    }
  };

  const lidarComAcerto = () => setRespostasCorretas((prev) => prev + 1);
  const lidarComErro = (detalheErro) => setErros((prev) => [...prev, detalheErro]);

  return (
    <div style={estilos.container}>
      <div style={estilos.topo}>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>🧟 Fuga da Floresta Zumbi</h2>
        <Link to="/painel" style={estilos.linkPainel}>📊 Painel</Link>
      </div>

      <div style={estilos.areaJogo}>
        <CenarioPhaser 
          aoAcertar={lidarComAcerto} 
          aoErrar={lidarComErro}
          aoGuardar={enviarTelemetria}
        />
      </div>
    </div>
  );
}

const estilos = {
  container: { 
    padding: '10px',
    backgroundColor: '#111', 
    minHeight: '100vh',
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box'
  },
  topo: { 
    display: 'flex', 
    alignItems: 'center', 
    justify: 'space-between', 
    padding: '8px 16px', 
    backgroundColor: '#1b262c',
    width: '100%',
    maxWidth: '800px',
    borderRadius: '8px 8px 0 0',
    boxSizing: 'border-box'
  },
  linkPainel: { color: '#4CAF50', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.9rem' },
  areaJogo: { 
    width: '100%',
    maxWidth: '800px',
    flex: 1
  }
};