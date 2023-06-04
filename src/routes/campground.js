const express = require('express');
const Joi = require('joi');
const ExpressError = require('../utils/ExpressError');
const { catchAsync } = require('../utils/catchAsync');
const CampgroundModel = require('../models/Campground');
const checkLogin = require('../middlewares/check-login');
const CampgroundController = require('../controllers/CampgroundController');

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
        throw new ExpressError(error.message, 400);
    }
    next();
};

const isAuthor = async (req, res, next) => {
    const campground = await CampgroundModel.findById(req.params.id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You don't have authorized access!!");
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
};

router.get('/', catchAsync(CampgroundController.index));

router.get('/new', checkLogin, (req, res) => {
    res.render('campgrounds/new');
});

router.post(
    '/',
    checkLogin,
    validateCampground,
    catchAsync(async (req, res) => {
        const campground = new CampgroundModel(req.body);
        campground.author = req.user._id;
        await campground.save();
        req.flash('success', 'Campground created successfully!!');
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.get(
    '/:id',
    catchAsync(async (req, res) => {
        const campground = await CampgroundModel.findById(req.params.id)
            .populate({
                path: 'reviews',
                populate: { path: 'author' },
            })
            .populate('author');
        if (!campground) {
            req.flash('error', 'Campground not found');
            return res.redirect('/campgrounds');
        }
        res.render('campgrounds/show', { campground });
    })
);

router.get(
    '/:id/edit',
    checkLogin,
    isAuthor,
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
    checkLogin,
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
    checkLogin,
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
