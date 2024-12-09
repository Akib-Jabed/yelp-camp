const catchAsync = require('../utils/catchAsync');
const { reviewService } = require('../services');

const postReview = catchAsync(async (req, res) => {
    const review = await reviewService.createReview(req);

    res.status(201).send(review);
});

const updateReview = catchAsync(async (req, res) => {
    const review = await reviewService.updateReview(req);

    res.status(200).send(review);
});

const deleteReview = catchAsync(async (req, res) => {
    await reviewService.deleteReview(req);

    res.status(204).send();
});

module.exports = {
    postReview,
    updateReview,
    deleteReview,
};
