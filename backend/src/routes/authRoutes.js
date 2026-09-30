// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authCtrl');

// Rota para criar um novo utilizador
// Chamada no frontend via: POST /api/auth/registar
router.post('/registar', authCtrl.registar);

// Rota para fazer o login
// Chamada no frontend via: POST /api/auth/login
router.post('/login', authCtrl.login);

module.exports = router;