const UserModel = require('../models/User');

exports.storeRegister = async (req, res, next) => {
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
};

exports.storeLogin = (req, res) => {
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    req.flash('success', 'Welcome back!!');
    res.redirect(redirectUrl);
};

exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
    });
    req.flash('success', 'Goodbye..!!!');
    res.redirect('/login');
};
