const express = require('express');
const routeResolver = require('../utils/route-resolver');
const auth = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', (req, res) => routeResolver(auth.login, req, res));

module.exports = router;
