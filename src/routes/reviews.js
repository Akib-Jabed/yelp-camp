const express = require('express');
const Joi = require('joi');
const ReviewModel = require('../models/Review');
const CampgroundModel = require('../models/Campground');
const ExpressError = require('../utils/ExpressError');
const { catchAsync } = require('../utils/catchAsync');

const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
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

router.post(
    '/',
    validateReview,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await CampgroundModel.findById(id);
        const review = new ReviewModel(req.body);
        campground.reviews.push(review);
        await campground.save();
        await review.save();

        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete(
    '/:rId',
    catchAsync(async (req, res) => {
        const { id, rId } = req.params;
        await CampgroundModel.findByIdAndUpdate(id, { $pull: { reviews: rId } });
        await ReviewModel.findByIdAndDelete(rId);
        res.redirect(`/campgrounds/${id}`);
    })
);

module.exports = router;
