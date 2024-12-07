const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssReqSanitizer = require('xss-req-sanitizer');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const ApiError = require('./utils/ApiError');
const logger = require('./config/logger');
const { errorConverter, errorHandler } = require('./middlewares/error');

const app = express();

// secure http headers
app.use(helmet());

// parse json request body
app.use(express.json());
// parse url-encoded request body
app.use(express.urlencoded({ extended: true }));
// set static file path
app.use(express.static(path.join(__dirname, 'public')));

// to sanitize http request data
app.use(xssReqSanitizer());
app.use(mongoSanitize());

// enable cors
app.use(cors());
app.options('*', cors());

app.use('/api', routes);

// middleware to handle unknown api requests
app.use((req, res, next) => {
    next(new ApiError(404, 'Not found'));
});

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
