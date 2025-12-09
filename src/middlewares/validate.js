const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
    const validationOptions = { abortEarly: false, allowUnknown: true };

    if (schema.body) {
        const { error } = schema.body.validate(req.body, validationOptions);
        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(', ');
            return next(new ApiError(400, errorMessage));
        }
    }

    if (schema.params) {
        const { error } = schema.params.validate(req.params, validationOptions);
        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(', ');
            return next(new ApiError(400, errorMessage));
        }
    }

    next();
};

module.exports = validate;
