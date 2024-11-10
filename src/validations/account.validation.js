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

const updatePassword = Joi.object({
    oldPassword: Joi.string().required().messages({
        'string.empty': 'Old password is required',
        'any.required': 'Old password is required',
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
    account,
    updatePassword,
};
