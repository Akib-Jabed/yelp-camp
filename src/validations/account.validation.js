const Joi = require('joi');

const account = Joi.object({
    firstName: Joi.string().required().messages({
        'string.empty': "First name can't be empty",
        'string.base': 'First name must be string',
        'any.required': 'First name is required',
    }),
    lastName: Joi.string().required().messages({
        'string.empty': "Last name can't be empty",
        'string.base': 'Last name must be string',
        'any.required': 'Last name is required',
    }),
});

module.exports = {
    account,
};
