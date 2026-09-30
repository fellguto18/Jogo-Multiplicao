// backend/src/config/database.js
const { Sequelize } = require('sequelize');

// Configura o Sequelize para usar o SQLite e criar um arquivo local
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './banco_de_dados.sqlite', // O arquivo será criado na raiz do backend
  logging: false // Evita poluir o terminal com comandos SQL
});

module.exports = sequelize;