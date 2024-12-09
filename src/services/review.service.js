const { Review, Campground } = require('../models');
const ApiError = require('../utils/ApiError');

const createReview = async (req) => {
    const campgroundId = req.originalUrl.split('/')[3];
    const campground = await Campground.findById(campgroundId);
    if (!campground) {
        throw new ApiError(404, 'Campground not found');
    }

    const review = new Review(req.body);
    review.campground = campgroundId;
    review.user = req.user.id;
    await review.save();

    return review;
};

const updateReview = async (req) => {
    const campgroundId = req.originalUrl.split('/')[3];
    const campground = await Campground.findById(campgroundId);
    if (!campground) {
        throw new ApiError(404, 'Campground not found');
    }

    const { reviewId } = req.params;
    const review = await Review.findByIdAndUpdate(reviewId, { ...req.body });

    if (!review) {
        throw new ApiError(404, 'Review not found');
    }
    if (review.user.id !== req.user.id) {
        throw new ApiError(403, 'Not authorized to update this review');
    }

    await review.save();
    return review;
};

const deleteReview = async (req) => {
    const campgroundId = req.originalUrl.split('/')[3];
    const campground = await Campground.findById(campgroundId);
    if (!campground) {
        throw new ApiError(404, 'Campground not found');
    }

    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, 'Review not found');
    }
    if (review.user.id !== req.user.id) {
        throw new ApiError(403, 'Not authorized to delete this review');
    }

    await Review.deleteOne({ _id: reviewId });
};

module.exports = {
    createReview,
    updateReview,
    deleteReview,
};
