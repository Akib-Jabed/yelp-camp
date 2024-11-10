const Joi = require('joi');

const register = Joi.object({
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
    email: Joi.string().required().email().messages({
        'string.empty': "Email can't be empty",
        'string.base': 'Email must be string',
        'string.email': 'Provide a valid email',
        'any.required': 'Email is required',
    }),
    role: Joi.string().required().valid('admin', 'user', 'guide').messages({
        'string.empty': "Role can't be empty",
        'string.base': 'Role must be string',
        'any.only': 'Role must be between admin, user or guide',
        'any.required': 'Role is required',
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

const forgetPassword = Joi.object({
    email: Joi.string().required().email().messages({
        'string.empty': "Email can't be empty",
        'string.base': 'Email must be string',
        'string.email': 'Provide a valid email',
        'any.required': 'Email is required',
    }),
});

const resetPassword = Joi.object({
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

module.exports = {
    register,
    login,
    forgetPassword,
    resetPassword,
};
