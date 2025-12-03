const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssReqSanitizer = require('xss-req-sanitizer');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const compression = require('compression');
const routes = require('./routes');
const ApiError = require('./utils/ApiError');
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

app.use(compression());
app.use(cookieParser());

// enable cors
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 10,
    delayMs: () => 500,
    maxDelayMs: 2000,
    skipSuccessfulRequests: true,
});

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: 'Too many requests, please try again later!',
});

app.use('/api/v1', rateLimiter);
app.use('/api/v1', speedLimiter);

app.use('/api/v1', routes);

// middleware to handle unknown api requests
app.use((req, res, next) => {
    next(new ApiError(404, 'Not found'));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
