const { Campground } = require('../models');
const ApiError = require('../utils/ApiError');

const createCampground = async (req) => {
    const campground = new Campground(req.body);
    campground.images = req.files.map((file) => file.filename);
    campground.user = req.user.id;
    await campground.save();

    return campground;
};

const getCampgrounds = async () => {
    const data = await Campground.find({});
    return data;
};

const getCampground = async (req) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        throw new ApiError(404, 'Campground not found');
    }

    return campground;
};

const updateCampground = async (req) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body });
    if (!campground) {
        throw new ApiError(404, 'Campground not found');
    }

    if (req.files) {
        campground.images.push(...req.files.map((file) => file.filename));
    }

    await campground.save();

    return campground;
};

const deleteCampground = async (req) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { active: false });
    if (!campground) {
        throw new ApiError(404, 'Campground not found');
    }

    return campground;
};

module.exports = {
    createCampground,
    getCampground,
    getCampgrounds,
    updateCampground,
    deleteCampground,
};
