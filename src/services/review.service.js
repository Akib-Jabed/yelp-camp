const { Review, Campground } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

const createReview = async (req) => {
    const { campgroundId } = req.params;
    const userId = req.user.id;

    const campground = await Campground.findById(campgroundId);
    if (!campground) {
        throw new ApiError(404, 'Campground not found');
    }

    const existingReview = await Review.findOne({ campground: campgroundId, user: userId });
    if (existingReview) {
        throw new ApiError(400, 'You have already reviewed this campground');
    }

    const review = await Review.create({
        ...req.body,
        campground: campgroundId,
        user: userId,
    });

    return review.populate('user', 'username email');
};

module.exports = {
    createReview,
};
