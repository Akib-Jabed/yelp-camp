const express = require('express');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const accountRoute = require('./account.route');
const tourRoute = require('./tour.route');

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
    {
        path: '/tours',
        route: tourRoute,
    },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
