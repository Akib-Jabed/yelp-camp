const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    next();
};

module.exports = validate;
