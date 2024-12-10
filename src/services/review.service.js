const { Review, Campground } = require('../models');
const ApiError = require('../utils/ApiError');

const checkCampground = async (req) => {
    const campgroundId = req.originalUrl.split('/')[3];
    const campground = await Campground.findById(campgroundId);
    if (!campground) {
        throw new ApiError(404, 'Campground not found');
    }

    return campgroundId;
};

const checkReview = async (req) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, 'Review not found');
    }
    if (review.user.id !== req.user.id) {
        throw new ApiError(403, 'Not authorized to delete this review');
    }

    return reviewId;
};

const createReview = async (req) => {
    const campgroundId = await checkCampground(req);

    const review = new Review(req.body);
    review.campground = campgroundId;
    review.user = req.user.id;
    await review.save();

    return review;
};

const updateReview = async (req) => {
    await checkCampground(req);
    const reviewId = await checkReview(req);
    const review = await Review.findByIdAndUpdate(reviewId, { ...req.body });
    return review;
};

const deleteReview = async (req) => {
    await checkCampground(req);
    const reviewId = await checkReview(req);
    await Review.deleteOne({ _id: reviewId });
};

module.exports = {
    createReview,
    updateReview,
    deleteReview,
};
