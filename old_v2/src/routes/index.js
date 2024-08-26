const express = require('express');
const authRouter = require('./auth.route');

const router = express.Router();

router.use('/auth', authRouter);
// router.get('/', (req, res) => res.send('Hello World'));

module.exports = router;
