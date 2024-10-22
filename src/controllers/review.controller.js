const { Review, Tour } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const postReview = catchAsync(async (req, res) => {
    const tourId = req.originalUrl.split('/')[2];
    const tour = await Tour.findById(tourId);
    if (!tour) {
        throw new ApiError(404, 'Tour not found');
    }
    const review = new Review(req.body);
    review.tour = tourId;
    review.user = req.user.id;
    await review.save();

    res.status(201).send(review);
});

module.exports = {
    postReview,
};
