const Joi = require('joi');

const review = Joi.object({
    title: Joi.string().required().min(3).max(30).messages({
        'string.empty': "Review title can't be empty",
        'string.base': 'Review title must be string',
        'any.required': 'Review title is required',
        'string.min': 'Review title must be minimum 3 characters long',
        'string.max': 'Review title must be maximum 30 characters long',
    }),
    body: Joi.string().required().messages({
        'string.empty': "Review body can't be empty",
        'string.base': 'Review body must be string',
        'any.required': 'Review body is required',
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
