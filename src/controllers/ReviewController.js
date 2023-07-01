const CampgroundModel = require('../models/Campground');
const ReviewModel = require('../models/Review');

exports.store = async (req, res) => {
    const { id } = req.params;
    const campground = await CampgroundModel.findById(id);
    const review = new ReviewModel(req.body);
    review.author = req.user._id;
    campground.reviews.push(review);
    await campground.save();
    await review.save();

    res.redirect(`/campgrounds/${campground._id}`);
};

exports.delete = async (req, res) => {
    const { id, rId } = req.params;
    await CampgroundModel.findByIdAndUpdate(id, { $pull: { reviews: rId } });
    await ReviewModel.findByIdAndDelete(rId);
    res.redirect(`/campgrounds/${id}`);
};
