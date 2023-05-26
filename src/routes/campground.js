const express = require('express');
const Joi = require('joi');
const ExpressError = require('../utils/ExpressError');
const { catchAsync } = require('../utils/catchAsync');
const CampgroundModel = require('../models/Campground');
const checkLogin = require('../middlewares/check-login');

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

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

router.post(
    '/',
    checkLogin,
    validateCampground,
    catchAsync(async (req, res) => {
        const campground = new CampgroundModel(req.body);
        await campground.save();
        req.flash('success', 'Campground created successfully!!');
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.get(
    '/:id',
    catchAsync(async (req, res) => {
        const campground = await CampgroundModel.findById(req.params.id).populate('reviews');
        if (!campground) {
            req.flash('error', 'Campground not found');
            return res.redirect('/campgrounds');
        }
        res.render('campgrounds/show', { campground });
    })
);

router.get(
    '/:id/edit',
    catchAsync(async (req, res) => {
        const campground = await CampgroundModel.findById(req.params.id);
        if (!campground) {
            req.flash('error', 'Campground not found');
            return res.redirect('/campgrounds');
        }
        res.render('campgrounds/edit', { campground });
    })
);

router.put(
    '/:id',
    validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await CampgroundModel.findByIdAndUpdate(id, { ...req.body });
        if (!campground) {
            req.flash('error', 'Campground not found');
            return res.redirect('/campgrounds');
        }
        req.flash('success', 'Campground updated successfully!!');
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete(
    '/:id',
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await CampgroundModel.findByIdAndDelete(id);
        if (!campground) {
            req.flash('error', 'Campground not found');
            return res.redirect('/campgrounds');
        }
        req.flash('success', 'Campground deleted successfully!!');
        res.redirect('/campgrounds');
    })
);

module.exports = router;
