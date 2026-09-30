// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importa a conexão com o banco de dados SQL
const sequelize = require('./src/config/database');

// Importação das rotas
const authRoutes = require('./src/routes/authRoutes');
const progressRoutes = require('./src/routes/progressRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/progresso', progressRoutes);

const PORT = process.env.PORT || 5000;

// Sincroniza o banco de dados (cria as tabelas automaticamente se não existirem)
sequelize.sync()
  .then(() => {
    console.log('✅ Banco de dados SQL (SQLite) sincronizado com sucesso!');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor a rodar em http://localhost:${PORT}`);
    });
  })
  .catch((erro) => {
    console.error('❌ Erro ao conectar ao banco de dados:', erro);
  });