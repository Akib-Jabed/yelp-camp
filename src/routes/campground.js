const express = require('express');
const Joi = require('joi');
const ExpressError = require('../utils/ExpressError');
const { catchAsync } = require('../utils/catchAsync');
const CampgroundModel = require('../models/Campground');

const router = express.Router();

const validateCampground = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        console.log(error.message);
        throw new ExpressError(error.message, 400);
    }
    next();
};

router.get(
    '/',
    catchAsync(async (req, res) => {
        const campgrounds = await CampgroundModel.find({});
        res.render('campgrounds/index', { campgrounds });
    })
);

router.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

router.post(
    '/',
    validateCampground,
    catchAsync(async (req, res) => {
        const campground = new CampgroundModel(req.body);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.get(
    '/:id',
    catchAsync(async (req, res) => {
        const campground = await CampgroundModel.findById(req.params.id).populate('reviews');
        res.render('campgrounds/show', { campground });
    })
);

router.get(
    '/:id/edit',
    catchAsync(async (req, res) => {
        const campground = await CampgroundModel.findById(req.params.id);
        res.render('campgrounds/edit', { campground });
    })
);

router.put(
    '/:id',
    validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await CampgroundModel.findByIdAndUpdate(id, { ...req.body });
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete(
    '/:id',
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await CampgroundModel.findByIdAndDelete(id);
        res.redirect('/campgrounds');
    })
);

module.exports = router;
