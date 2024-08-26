const express = require('express');
const userRoute = require('./user.route');

const router = express.Router();

const routes = [
    {
        path: '/users',
        route: userRoute,
    },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
