// backend/src/models/Analytics.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Player = require('./Player'); // Importamos o Player para criar a relação

const Analytics = sequelize.define('Analytics', {
  tabuadaFoco: {
    type: DataTypes.INTEGER,
    allowNull: false // Ex: 4
  },
  respostasCorretas: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  errosDetalhados: {
    type: DataTypes.JSON, // Guarda o array de erros: [{ operacao: "4x6", respostaDada: 20 }]
    defaultValue: []
  },
  tempoMedioRespostas: {
    type: DataTypes.FLOAT, // Em segundos
    defaultValue: 0
  },
  faseConcluida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  dataSessao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Define o relacionamento: Um Player pode ter várias sessões de Analytics
Player.hasMany(Analytics, { foreignKey: 'playerId' });
Analytics.belongsTo(Player, { foreignKey: 'playerId' });

module.exports = Analytics;