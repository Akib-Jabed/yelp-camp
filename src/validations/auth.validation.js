const Joi = require('joi');

const register = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': "Name can't be empty",
        'string.base': 'Name must be string',
        'any.required': 'Name is required',
    }),
    email: Joi.string().required().email().messages({
        'string.empty': "Email can't be empty",
        'string.base': 'Email must be string',
        'string.email': 'Provide a valid email',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required().min(8).alphanum().messages({
        'string.empty': "Password can't be empty",
        'string.base': 'Password must be string',
        'string.alphanum': 'Password must be combination of number and string',
        'string.min': 'Password must be 8 characters long',
        'any.required': 'Password is required',
    }),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
        'string.empty': "Confirm password can't be empty",
        'any.required': 'Confirm password is required',
        'any.only': 'Password must match',
    }),
});

const login = Joi.object({
    email: Joi.string().required().email().messages({
        'string.empty': "Email can't be empty",
        'string.base': 'Email must be string',
        'string.email': 'Provide a valid email',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
    }),
});

const updatePassword = Joi.object({
    currentPassword: Joi.string().required().messages({
        'string.empty': 'Current password is required',
        'any.required': 'Current password is required',
    }),
    newPassword: Joi.string().required().min(8).alphanum().messages({
        'string.empty': "New password can't be empty",
        'string.base': 'New password must be string',
        'string.alphanum': 'New password must be combination of number and string',
        'string.min': 'New password must be 8 characters long',
        'any.required': 'New password is required',
    }),
    confirmPassword: Joi.string().required().valid(Joi.ref('newPassword')).messages({
        'string.empty': "Confirm password can't be empty",
        'any.required': 'Confirm password is required',
        'any.only': 'Password must match with new password',
    }),
});

module.exports = {
    register,
    login,
    updatePassword,
};
