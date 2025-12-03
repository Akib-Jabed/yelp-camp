const Joi = require('joi');

const campground = Joi.object({
    title: Joi.string().required().min(3).max(30).messages({
        'string.empty': "Title can't be empty",
        'string.base': 'Title must be string',
        'any.required': 'Title is required',
        'string.min': 'Title must be minimum 3 characters long',
        'string.max': 'Title must be maximum 30 characters long',
    }),
    description: Joi.string().required().messages({
        'string.empty': "Description can't be empty",
        'string.base': 'Description must be string',
        'any.required': 'Description is required',
    }),
    location: Joi.string().required().messages({
        'string.empty': "Location can't be empty",
        'string.base': 'Location must be string',
        'any.required': 'Location is required',
    }),
    price: Joi.number().required().min(1).messages({
        'number.base': 'Price must be a number',
        'any.required': 'Price is required',
        'number.min': 'Invalid price given',
    }),
    // files: Joi.array().items(
    //     Joi.object({
    //         originalname: Joi.string(),
    //         encoding: Joi.string(),
    //         mimetype: Joi.string()
    //     })
    // ).optional().allow(null).default([])
});

module.exports = {
    campground,
};
