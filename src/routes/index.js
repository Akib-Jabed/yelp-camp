const express = require('express');
const config = require('../config/config');
const authRoute = require('./auth.route');
const tourRoute = require('./tour.route');
const reviewRoute = require('./review.route');
const docsRoute = require('./docs.route');

const router = express.Router();

const routes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/tours',
        route: tourRoute,
    },
    {
        path: '/tours/:tourId/reviews',
        route: reviewRoute,
    },
];

if (config.env === 'development') {
    routes.push({
        path: '/docs',
        route: docsRoute,
    });
}

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
