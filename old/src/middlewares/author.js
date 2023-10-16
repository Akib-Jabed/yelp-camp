const CampgroundModel = require('../models/Campground');
const ReviewModel = require('../models/Review');

exports.isReviewAuthor = async (req, res, next) => {
    const review = await ReviewModel.findById(req.params.rId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You don't have authorized access!!");
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
};

exports.isCampgroundAuthor = async (req, res, next) => {
    const campground = await CampgroundModel.findById(req.params.id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You don't have authorized access!!");
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
};
