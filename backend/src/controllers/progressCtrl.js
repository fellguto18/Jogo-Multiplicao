// backend/src/controllers/progressCtrl.js
const Analytics = require('../models/Analytics');

const progressCtrl = {
  guardarSessao: async (req, res) => {
    try {
      const { playerId, tabuadaFoco, respostasCorretas, errosDetalhados, tempoMedioRespostas, faseConcluida } = req.body;

      const novaSessao = await Analytics.create({
        playerId,
        tabuadaFoco,
        respostasCorretas,
        errosDetalhados,
        tempoMedioRespostas,
        faseConcluida
      });

      res.status(201).json({ mensagem: "Progresso guardado com sucesso!" });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: "Erro ao guardar os dados da sessão de jogo." });
    }
  },

  obterRelatorioAluno: async (req, res) => {
    try {
      const { playerId } = req.params;

      // Comando SQL: SELECT * FROM Analytics WHERE playerId = '...' ORDER BY dataSessao DESC
      const relatorios = await Analytics.findAll({ 
        where: { playerId },
        order: [['dataSessao', 'DESC']]
      });

      if (!relatorios || relatorios.length === 0) {
        return res.status(404).json({ mensagem: "Nenhum dado encontrado para este aluno." });
      }

      res.status(200).json(relatorios);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: "Erro ao obter o relatório do aluno." });
    }
  }
};

module.exports = progressCtrl;