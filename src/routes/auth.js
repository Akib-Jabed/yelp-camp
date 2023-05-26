const express = require('express');
const passport = require('passport');
const UserModel = require('../models/User');
const { catchAsync } = require('../utils/catchAsync');

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post(
    '/register',
    catchAsync(async (req, res, next) => {
        try {
            const { username, email, password } = req.body;
            const user = new UserModel({ email, username });
            const currentUser = await UserModel.register(user, password);
            req.login(currentUser, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash('success', 'Registration Successful. Welcome to Yelp Camp!!');
                res.redirect('/campgrounds');
            });
        } catch (err) {
            req.flash('error', err.message);
            res.redirect('/register');
        }
    })
);

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post(
    '/login',
    passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login',
    }),
    (req, res) => {
        const redirectUrl = res.locals.returnTo || '/campgrounds';
        delete req.session.returnTo;
        req.flash('success', 'Welcome back!!');
        res.redirect(redirectUrl);
    }
);

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
    });
    req.flash('success', 'Goodbye..!!!');
    res.redirect('/login');
});

module.exports = router;
