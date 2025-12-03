const { Campground, Review } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/ApiFeatures');
const mongoose = require('mongoose');

const isUniqueTitle = async (title) => {
    if (await Campground.isTitleTaken(title)) {
        throw new ApiError(409, 'Title already taken');
    }
}

const createCampground = async (requestObj) => {
    const {body, files, userId} = requestObj
    const { title } = body;
    await isUniqueTitle(title)
    const campground = new Campground(body);
    campground.images = files?.map((file) => file.filename);
    campground.user = userId;
    await campground.save();
    return campground;
};

const getCampgrounds = async (req) => {
    const features = new ApiFeatures(Campground.find({}).select('id title description location price images createdAt').lean(), req.query);
    const data = await features.filter().sort().paginate().query;
    
    return data;
};

const getCampground = async (req) => {
    const campground = await Campground.findById(req.params.id)
    .populate({
        path: 'user',
        select: 'username email'
    }).populate({
        path: 'reviews',
        select: 'body rating',
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

const updateCampground = async (req) => {
    const campground = await getCampground(req);
    checkValidUser(campground.user.id, req.user.id);
    
    const { title } = req.body;
    isUniqueTitle(title)
    
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
    
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await Review.deleteMany({ campground: req.params.id }, {session});
        await Campground.deleteOne({ _id: req.params.id }, {session});
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
