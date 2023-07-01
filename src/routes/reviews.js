const express = require('express');
const { catchAsync } = require('../utils/catchAsync');
const checkLogin = require('../middlewares/check-login');
const { isReviewAuthor } = require('../middlewares/author');
const validateReview = require('../validators/review');
const ReviewController = require('../controllers/ReviewController');

const router = express.Router({ mergeParams: true });

router.post('/', checkLogin, validateReview, catchAsync(ReviewController.store));

router.delete('/:rId', checkLogin, isReviewAuthor, catchAsync(ReviewController.delete));

module.exports = router;
