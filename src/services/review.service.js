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

const createReview = async (req) => {
    const campgroundId = await checkCampground(req);

    const review = new Review(req.body);
    review.campground = campgroundId;
    review.user = req.user.id;
    await review.save();

    return review;
};

module.exports = {
    createReview,
};
