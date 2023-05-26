const express = require('express');
const UserModel = require('../models/User');
const { catchAsync } = require('../utils/catchAsync');

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post(
    '/register',
    catchAsync(async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const user = new UserModel({ email, username });
            await UserModel.register(user, password);
            req.flash('success', 'Registration Successful. Welcome to Yelp Camp!!');
            res.redirect('/campgrounds');
        } catch (err) {
            req.flash('error', err.message);
            res.redirect('/auth/register');
        }
    })
);

module.exports = router;
