const jwt = require('jsonwebtoken');
const { User, Token } = require('../models');
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

const loginUser = async (data) => {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(403, 'Invalid credential');
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
    };
};

const logoutUser = async (data) => {
    const { token, user } = data;

    await Token.create({ token, user: user.id, blacklisted: true });
};

const generateToken = (user, expires = config.jwt.expires, secret = config.jwt.secret) => {
    const payload = {
        data: user,
    };

    return jwt.sign(payload, secret, { expiresIn: expires });
};

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    generateToken,
};
