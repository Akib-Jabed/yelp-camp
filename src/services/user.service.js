const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const createUser = async (data) => {
    if (await User.isEmailTaken(data.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    return User.create(data);
};

module.exports = {
    createUser,
};
