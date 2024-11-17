const express = require('express');
const config = require('../config/config');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const accountRoute = require('./account.route');
const tourRoute = require('./tour.route');
const reviewRoute = require('./review.route');
const bookingRoute = require('./booking.route');
const docsRoute = require('./docs.route');

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
    {
        path: '/tours/:tourId/reviews',
        route: reviewRoute,
    },
    {
        path: '/bookings',
        route: bookingRoute,
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
