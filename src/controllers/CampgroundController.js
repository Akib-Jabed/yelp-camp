const CampgroundModel = require('../models/Campground');

exports.index = async (req, res) => {
    const campgrounds = await CampgroundModel.find({});
    res.render('campgrounds/index', { campgrounds });
};

exports.store = async (req, res) => {
    const campground = new CampgroundModel(req.body);
    campground.images = req.files.map((file) => file.filename);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Campground created successfully!!');
    res.redirect(`/campgrounds/${campground._id}`);
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const campground = await CampgroundModel.findByIdAndUpdate(id, { ...req.body });
    campground.images.push(...req.files.map((file) => file.filename));
    await campground.save();
    if (req.body.deleteImages) {
        await campground.updateOne({
            $pull: { images: { $in: req.body.deleteImages } },
        });
    }
    req.flash('success', 'Campground updated successfully!!');
    res.redirect(`/campgrounds/${campground._id}`);
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    const campground = await CampgroundModel.findByIdAndDelete(id);
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    req.flash('success', 'Campground deleted successfully!!');
    res.redirect('/campgrounds');
};

exports.show = async (req, res) => {
    const campground = await CampgroundModel.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: { path: 'author' },
        })
        .populate('author');
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
};

exports.showEdit = async (req, res) => {
    const campground = await CampgroundModel.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};
