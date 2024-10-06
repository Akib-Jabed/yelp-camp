const express = require('express');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const accountRoute = require('./account.route');

const router = express.Router();

const routes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/users',
        route: userRoute,
    },
    {
        path: '/account',
        route: accountRoute,
    },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
