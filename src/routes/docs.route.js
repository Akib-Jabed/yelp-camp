const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Yelp-Camp Api',
            version: '1.0.0',
            description: 'This is an API application for Yelp-Camp made with Express and Mongodb',
            license: {
                name: 'MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'Akib Jabed',
                email: 'a.jabed.bd@gmail.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
            },
        ],
    },
    apis: ['src/docs/*.yml', 'src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

router.use('/', swaggerUi.serve);
router.get(
    '/',
    swaggerUi.setup(specs, {
        explorer: true,
    })
);

module.exports = router;
