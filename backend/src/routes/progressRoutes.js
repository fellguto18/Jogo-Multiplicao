// backend/src/routes/progressRoutes.js
const express = require('express');
const router = express.Router();
const progressCtrl = require('../controllers/progressCtrl');

// Rota para o jogo enviar os dados silenciosamente no fim de uma fase
// Chamada no frontend via: POST /api/progresso/sessao
router.post('/sessao', progressCtrl.guardarSessao);

// Rota para o painel do psicopedagogo obter os gráficos de um aluno específico
// Chamada no frontend via: GET /api/progresso/relatorio/:playerId
router.get('/relatorio/:playerId', progressCtrl.obterRelatorioAluno);

module.exports = router;