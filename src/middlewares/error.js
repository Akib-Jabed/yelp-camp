const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const logger = require('../config/logger');

const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(err instanceof ApiError)) {
        const statusCode = err.statusCode || err instanceof mongoose.Error ? 400 : 500;
        const message = err.message || 'Something went wrong';
        error = new ApiError(statusCode, message, false);
    }
    
    next(error);
};

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);
    let { statusCode, message } = err;
    if (config.env === 'production' && !err.isOperational) {
        statusCode = 500;
        message = 'Something went wrong';
    }

    const response = {
        success: false,
        code: statusCode,
        message,
    };

    res.status(statusCode).send(response);
};

module.exports = {
    errorConverter,
    errorHandler,
};
