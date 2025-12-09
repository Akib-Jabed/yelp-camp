const cloudinary = require('../config/cloudinary');

const deleteFile = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        })
        return result;
    } catch (err) {
        throw new Error('Error deleting File', error);
    }
}

const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new Error('Error deleting image', error);
    }
}

const deleteImages = async (publicIds) => {
    try {
        const result = await cloudinary.api.delete_resources(publicIds);
        return result;
    } catch (error) {
        throw new Error('Error deleting images', error);
    }
}

module.exports = {
    deleteFile,
    deleteImage,
    deleteImages
}