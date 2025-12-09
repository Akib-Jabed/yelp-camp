const { Campground, Review } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/ApiFeatures');
const mongoose = require('mongoose');
const { deleteImages } = require('../utils/cloudinary');

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
    campground.images = files?.map((file) => (
        {
            publicId: file.public_id,
            secureUrl: file.secure_url
        })
    );
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

const getImagesToDelete = (database, payload) => {
    return database.images.filter(image => !payload.some(el => el.publicId === image.publicId))
}

const updateCampground = async (requestObj) => {
    const { campgroundId, body, existingImages, files, userId } = requestObj;
    const campground = await getCampground(campgroundId);

    checkValidUser(campground.user.id, userId);
    await isUniqueTitle(body.title, campgroundId)

    const imagesToDelete = campground.images.filter(image => !existingImages.some(el => el.publicId === image.publicId))
    if (imagesToDelete.length > 0) {
        const publicIds = imagesToDelete.map(image => image.publicId)
        await deleteImages(publicIds)
    }

    campground.set({ ...body });
    campground.images = existingImages;
    if (files && files.length > 0) {
        campground.images.push(...files.map((file) => (
            {
                publicId: file.public_id,
                secureUrl: file.secure_url
            })
        ));
    }
    await campground.save();

    return campground;
};

const deleteCampground = async (requestObj) => {
    const { campgroundId, userId } = requestObj
    const campground = await getCampground(campgroundId);
    checkValidUser(campground.user.id, userId);

    const publicIds = campground.images.map(image => image.publicId)
    if (publicIds.length > 0) await deleteImages(publicIds)

    await Review.deleteMany({ campground: campgroundId });
    await Campground.deleteOne({ _id: campgroundId });
};

module.exports = {
    createCampground,
    getCampground,
    getCampgrounds,
    updateCampground,
    deleteCampground,
    checkValidUser
};
