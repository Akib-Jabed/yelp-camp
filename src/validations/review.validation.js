const Joi = require('joi');

const review = Joi.object({
    comment: Joi.string().required().messages({
        'string.empty': "Review comment can't be empty",
        'string.base': 'Review comment must be string',
        'any.required': 'Review comment is required',
    }),
    rating: Joi.number().required().min(1).max(5).messages({
        'number.base': 'Review rating must be a number',
        'any.required': 'Review rating is required',
        'number.min': 'Invalid review rating',
        'number.max': 'Invalid review rating',
    }),
});

module.exports = {
    review,
};
