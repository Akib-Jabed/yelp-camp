const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const createUser = async (data) => {
    if (await User.isEmailTaken(data.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    return User.create(data);
};

const queryUsers = async (filter, options) => {
    const users = await User.paginate(filter, options);
    return users;
};

module.exports = {
    createUser,
    queryUsers,
};
