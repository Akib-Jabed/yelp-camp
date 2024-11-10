const Joi = require('joi');

const booking = Joi.object({
    tour: Joi.string().required().messages({
        'string.empty': "Tour can't be empty",
        'string.base': 'Tour must be string',
        'any.required': 'Tour is required for booking',
    }),
    amount: Joi.number().required().min(1).messages({
        'number.base': 'Booking amount must be a number',
        'any.required': 'Booking amount is required',
        'number.min': 'Invalid booking amount',
    }),
});

module.exports = {
    booking,
};
