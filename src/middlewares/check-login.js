const checkLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please sign in first!!');
        return res.redirect('/login');
    }

    next();
};

module.exports = checkLogin;
