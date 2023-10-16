const Joi = require('joi');
const ExpressError = require('../utils/ExpressError');

module.exports = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        description: Joi.string().required(),
        deleteImages: Joi.array(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        throw new ExpressError(error.message, 400);
    }
    next();
};
