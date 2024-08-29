const Joi = require('joi');

const createUser = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string()
        .required()
        .min(8)
        .pattern(/[a-zA-Z0-9]/),
    repeatPassword: Joi.ref('password'),
    role: Joi.string().required().valid('user', 'admin'),
});

module.exports = {
    createUser,
};
