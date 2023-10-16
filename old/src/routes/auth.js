const express = require('express');
const passport = require('passport');
const AuthController = require('../controllers/AuthController');
const { catchAsync } = require('../utils/catchAsync');

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', catchAsync(AuthController.storeRegister));

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post(
    '/login',
    passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login',
    }),
    AuthController.storeLogin
);

router.get('/logout', AuthController.logout);

module.exports = router;
