const Joi = require('joi');
const ExpressError = require('../utils/ExpressError');

module.exports = (req, res, next) => {
    const schema = Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        console.log(error.message);
        throw new ExpressError(error.message, 400);
    }
    next();
};
