const mongoose = require('mongoose');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(err instanceof ApiError)) {
        const statusCode =
            err.statusCode || err instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
        const message = err.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, false);
    }
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (config.env === 'production' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }

    const response = {
        code: statusCode,
        message,
    };

    res.status(statusCode).send(response);
};

module.exports = {
    errorConverter,
    errorHandler,
};
