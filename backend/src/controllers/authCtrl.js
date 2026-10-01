// backend/src/controllers/authCtrl.js
const Player = require('../models/Player');

const authCtrl = {
  registar: async (req, res) => {
    try {
      const { nome, email, senha, tipo } = req.body;

      // Comando SQL: INSERT INTO Players...
      const novoUtilizador = await Player.create({ nome, email, senha, tipo });

      res.status(201).json({ 
        mensagem: "Usuário criado com sucesso!", 
        utilizador: novoUtilizador 
      });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: "Erro ao registar o usuário no sistema." });
    }
  },

  login: async (req, res) => {
    try {
      const { email, senha } = req.body;

      // Comando SQL: SELECT * FROM Players WHERE email = '...' LIMIT 1
      const utilizador = await Player.findOne({ where: { email } });

      if (!utilizador || utilizador.senha !== senha) {
        return res.status(401).json({ erro: "Email ou senha incorretos." });
      }

      res.status(200).json({ 
        mensagem: "Login bem-sucedido!", 
        utilizador 
      });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: "Erro ao processar o login." });
    }
  }
};

module.exports = authCtrl;
