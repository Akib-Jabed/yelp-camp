const Joi = require('joi');

const createTour = Joi.object({
    title: Joi.string().required().min(8).max(30).messages({
        'string.empty': "Tour Title can't be empty",
        'string.base': 'Tour Title must be string',
        'any.required': 'Tour Title is required',
        'string.min': 'Tour title must be minimum 3 characters long',
        'string.max': 'Tour title must be maximum 30 characters long',
    }),
    duration: Joi.number().required().min(1).messages({
        'number.base': 'Tour duration must be a number',
        'any.required': 'Tour duration is required',
        'number.min': 'Invalid tour duration',
    }),
    groupSize: Joi.number().required().min(1).messages({
        'number.base': 'Group size must be a number',
        'any.required': 'Group size is required',
        'number.min': 'Invalid group size',
    }),
    difficulty: Joi.string().required().valid('easy', 'normal', 'difficult').messages({
        'string.empty': "Tour difficulty level can't be empty",
        'string.base': 'Tour difficulty level must be string',
        'any.only': 'Tour difficulty level must be between easy, normal or difficult',
        'any.required': 'Tour difficulty level is required',
    }),
    price: Joi.number().required().min(1).messages({
        'number.base': 'Tour price must be a number',
        'any.required': 'Tour price is required',
        'number.min': 'Invalid tour price',
    }),
    description: Joi.string().required().messages({
        'string.empty': "Tour description can't be empty",
        'string.base': 'Tour description must be string',
        'any.required': 'Tour description is required',
    }),
    location: Joi.string().required().messages({
        'string.empty': "Tour location can't be empty",
        'string.base': 'Tour location must be string',
        'any.required': 'Tour location is required',
    }),
});

module.exports = {
    createTour,
};
