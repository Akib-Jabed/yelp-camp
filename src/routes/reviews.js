const express = require('express');

const ReviewModel = require('../models/Review');
const CampgroundModel = require('../models/Campground');
const { catchAsync } = require('../utils/catchAsync');
const checkLogin = require('../middlewares/check-login');
const { isReviewAuthor } = require('../middlewares/author');
const validateReview = require('../validators/review');

const router = express.Router({ mergeParams: true });

router.post(
    '/',
    checkLogin,
    validateReview,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await CampgroundModel.findById(id);
        const review = new ReviewModel(req.body);
        review.author = req.user._id;
        campground.reviews.push(review);
        await campground.save();
        await review.save();

        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete(
    '/:rId',
    checkLogin,
    isReviewAuthor,
    catchAsync(async (req, res) => {
        const { id, rId } = req.params;
        await CampgroundModel.findByIdAndUpdate(id, { $pull: { reviews: rId } });
        await ReviewModel.findByIdAndDelete(rId);
        res.redirect(`/campgrounds/${id}`);
    })
);

module.exports = router;
