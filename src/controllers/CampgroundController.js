const CampgroundModel = require('../models/Campground');

module.exports.index = async (req, res) => {
    const campgrounds = await CampgroundModel.find({});
    res.render('campgrounds/index', { campgrounds });
};
