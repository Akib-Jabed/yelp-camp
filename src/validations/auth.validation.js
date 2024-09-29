const Joi = require('joi');

const register = Joi.object({});

const login = Joi.object({
    email: Joi.string().required().email().messages({
        'string.empty': 'Email is required',
        'string.base': 'Email must be a string',
        'string.email': 'Provide a valid email',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
    }),
});

module.exports = {
    login,
};
