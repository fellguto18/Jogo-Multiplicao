// backend/src/models/Player.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Player = sequelize.define('Player', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Evita e-mails duplicados
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING,
    defaultValue: 'aluno' // Pode ser 'aluno' ou 'educador'
  },
  // Dados de progresso do jogo
  nivelAtual: {
    type: DataTypes.STRING,
    defaultValue: 'Explorador' // Nível 1: Tabuadas 2, 3 e 4[cite: 3]
  },
  tijolosAcumulados: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Player;