const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssReqSanitizer = require('xss-req-sanitizer');
const cors = require('cors');

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

module.exports = app;
