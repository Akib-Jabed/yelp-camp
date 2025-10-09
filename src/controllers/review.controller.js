const catchAsync = require('../utils/catchAsync');
const { reviewService } = require('../services');

const postReview = catchAsync(async (req, res) => {
    const review = await reviewService.createReview(req);

    res.status(201).send({ data: review });
});

module.exports = {
    postReview,
};
