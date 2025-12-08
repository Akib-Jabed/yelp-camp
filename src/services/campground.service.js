const { Campground, Review } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/ApiFeatures');
const mongoose = require('mongoose');

const isUniqueTitle = async (title, excludeCampgroundId = null) => {
    if (await Campground.isTitleTaken(title, excludeCampgroundId)) {
        throw new ApiError(409, 'Title already taken');
    }
}

const createCampground = async (requestObj) => {
    const { body, files, userId } = requestObj
    const { title } = body;
    await isUniqueTitle(title)
    const campground = new Campground(body);
    campground.images = files?.map((file) => file.secure_url);
    campground.user = userId;
    await campground.save();
    return campground;
};

const getCampgrounds = async (req) => {
    const features = new ApiFeatures(
        Campground.find({}).select('title description location price images createdAt'),
        req.query
    );
    features.filter().sort().paginate();

    const [data, totalCount] = await Promise.all([
        features.query.exec(),
        features.getCount()
    ])

    return [data, totalCount];
};

const getCampground = async (campgroundId) => {
    const campground = await Campground.findById(campgroundId)
        .populate({
            path: 'user',
            select: 'username email'
        }).populate({
            path: 'reviews',
            select: 'comment rating createdAt',
            populate: {
                path: 'user',
                select: 'username'
            }
        });
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

const updateCampground = async (requestObj) => {
    const { campgroundId, body, files, userId } = requestObj;
    const campground = await getCampground(campgroundId);

    checkValidUser(campground.user.id, userId);
    await isUniqueTitle(body.title, campgroundId)

    campground.set({ ...body });
    if (files && files.length > 0) {
        campground.images.push(...files.map((file) => file.secure_url));
    }
    await campground.save();

    return campground;
};

const deleteCampground = async (req) => {
    const campground = await getCampground(req);
    checkValidUser(campground.user.id, req.user.id);

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await Review.deleteMany({ campground: req.params.id }, { session });
        await Campground.deleteOne({ _id: req.params.id }, { session });
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }

    const oldImages = campground.images;
    oldImages.forEach((img) => fs.unlinkSync(`public/uploads/${img}`));
    oldImages.forEach((img) => fs.unlinkSync(`public/uploads/thumbs/${img}`));
};

module.exports = {
    createCampground,
    getCampground,
    getCampgrounds,
    updateCampground,
    deleteCampground,
    checkValidUser
};
