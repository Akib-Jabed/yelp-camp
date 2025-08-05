const { Campground, Review } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/ApiFeatures');

const createCampground = async (req) => {
    const campground = new Campground(req.body);
    campground.images = req.files?.map((file) => file.filename);
    campground.user = req.user.id;
    await campground.save();

    return campground;
};

const getCampgrounds = async (req) => {
    const features = new ApiFeatures(Campground.find({}), req.query);
    const data = await features.filter().sort().paginate().query;

    return data;
};

const getCampground = async (req) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        throw new ApiError(404, 'Campground not found');
    }

    return campground;
};

const checkValidUser = (campgroundUser, loggedUser) => {
    if (campgroundUser.toString() !== loggedUser.toString()) {
        throw new ApiError(403, "Don't have access to take this action");
    }
};

const updateCampground = async (req) => {
    const campground = await getCampground(req);
    checkValidUser(campground.user.id, req.user.id);

    campground.set({ ...req.body });
    if (req.files) {
        campground.images.push(...req.files.map((file) => file.filename));
    }
    await campground.save();

    return campground;
};

const deleteCampground = async (req) => {
    const campground = await getCampground(req);
    checkValidUser(campground.user.id, req.user.id);

    await Review.deleteMany({ campground: req.params.id });
    await Campground.deleteOne({ _id: req.params.id });
};

module.exports = {
    createCampground,
    getCampground,
    getCampgrounds,
    updateCampground,
    deleteCampground,
};
