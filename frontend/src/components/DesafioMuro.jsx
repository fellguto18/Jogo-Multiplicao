import { useState, useEffect } from 'react';

export default function DesafioMuro({ tabuadaFoco = 5, aoAcertar, aoErrar }) {
  const [fatorB, setFatorB] = useState(null);
  const [filaFatores, setFilaFatores] = useState([]);
  const [resposta, setResposta] = useState('');
  const [feedback, setFeedback] = useState('');

  // Função para embaralhar um array (Algoritmo Fisher-Yates)
  const embaralhar = (array) => {
    const lista = [...array];
    for (let i = lista.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
  };

  // Gera uma nova lista embaralhada com números de 2 a 10
  const gerarNovaFila = () => {
    const numeros = [2, 3, 4, 5, 6, 7, 8, 9, 10];
    return embaralhar(numeros);
  };

  // Função para pegar o próximo número garantindo que não haja repetições imediatas
  const obterProximoFator = (filaAtual) => {
    let novaFila = [...filaAtual];
    
    // Se a fila acabou, cria uma nova rodada embaralhada
    if (novaFila.length === 0) {
      novaFila = gerarNovaFila();
    }

    // Remove e pega o primeiro elemento da fila
    const proximo = novaFila.shift();
    setFilaFatores(novaFila);
    setFatorB(proximo);
  };

  // Inicializa ou reinicia a fila sempre que a tabuada mudar
  useEffect(() => {
    const novaFila = gerarNovaFila();
    const primeiro = novaFila.shift();
    setFilaFatores(novaFila);
    setFatorB(primeiro);
    setResposta('');
    setFeedback('');
  }, [tabuadaFoco]);

  const validarResposta = (e) => {
    e.preventDefault();
    const valorCorreto = tabuadaFoco * fatorB;
    const respostaDada = parseInt(resposta, 10);

    if (respostaDada === valorCorreto) {
      setFeedback('Boa! Ganhou os tijolos!');
      aoAcertar(valorCorreto);
      setResposta('');
      obterProximoFator(filaFatores); // Passa para o próximo fator da fila
    } else {
      setFeedback('Vamos tentar de novo! Conte com calma.');
      aoErrar({ operacao: `${tabuadaFoco}x${fatorB}`, respostaDada });
      setResposta('');
      obterProximoFator(filaFatores); // Também muda para não travar na mesma conta
    }
  };

  if (fatorB === null) return null;

  return (
    <div style={estilos.caixa}>
      <h3>Construir Muro (Tabuada do {tabuadaFoco})</h3>
      <p>Um muro possui {tabuadaFoco} fileiras de {fatorB} tijolos.</p>
      <p>Quantos tijolos serão necessários?</p>
      
      <form onSubmit={validarResposta} style={estilos.formulario}>
        <input 
          type="number" 
          value={resposta}
          onChange={(e) => setResposta(e.target.value)}
          placeholder="Digite sua resposta"
          required
          style={estilos.input}
        />
        <button type="submit" style={estilos.botao}>Construir</button>
      </form>
      
      {feedback && <p style={estilos.feedback}>{feedback}</p>}
    </div>
  );
}

const estilos = {
  caixa: { border: '2px solid #4CAF50', padding: '20px', borderRadius: '10px', textAlign: 'center', backgroundColor: '#e8f5e9' },
  formulario: { display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' },
  input: { padding: '10px', fontSize: '16px', width: '120px', textAlign: 'center' },
  botao: { padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  feedback: { marginTop: '15px', fontWeight: 'bold', color: '#333' }
};