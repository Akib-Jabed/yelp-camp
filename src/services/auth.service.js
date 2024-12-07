const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const createUser = async (data) => {
    const { email } = { data };
    if (await User.isEmailTaken(email)) {
        throw new ApiError(409, 'Email already taken');
    }

    const user = await User.create(data);
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
    };
};

const generateToken = (user, expires = config.jwt.expires, secret = config.jwt.secret) => {
    const payload = {
        data: user,
    };

    return jwt.sign(payload, secret, { expiresIn: expires });
};

module.exports = {
    createUser,
    generateToken,
};
