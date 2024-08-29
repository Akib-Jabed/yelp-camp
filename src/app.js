const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssReqSanitizer = require('xss-req-sanitizer');
const cors = require('cors');
const httpStatus = require('http-status');
const routes = require('./routes');
const ApiError = require('./utils/ApiError');
const { errorConverter, errorHandler } = require('./middlewares/error');

const app = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// to sanitize http request data
app.use(xssReqSanitizer());
app.use(mongoSanitize());

// enable cors
app.use(cors());
app.options('*', cors());

app.use('/', routes);
// middleware to handle unknown api requests
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
