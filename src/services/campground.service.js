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

const getCampground = async (queryParam) => {
    const { slug } = queryParam;
    const campground = await Campground.findOne({ slug });
    if (!campground) {
        throw new ApiError(404, 'Campground not found');
    }

    return campground;
};

const updateCampground = async (req) => {
    const { slug } = req.params;
    const campground = await Campground.findOneAndUpdate({ slug }, { ...req.body });
    if (!campground) {
        throw new ApiError(404, 'Campground not found');
    }
    campground.images.push(...req.files.map((file) => file.filename));
    await campground.save();

    return campground;
};

const deleteCampground = async (req) => {
    const { slug } = req.params;

    const campground = await Campground.findOneAndUpdate({ slug }, { active: false });
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
