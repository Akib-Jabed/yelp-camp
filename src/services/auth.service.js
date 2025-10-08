const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const registerUser = async (data) => {
    const { email, username } = data;

    if (await User.isEmailTaken(email)) {
        throw new ApiError(409, 'Email already taken');
    }

    if (await User.isUsernameTaken(username)) {
        throw new ApiError(409, 'Username already taken');
    }

    const user = await User.create(data);
    return {
        id: user.id,
        username: user.username,
        email: user.email,
    };
};

const loginUser = async (data) => {
    const { email, password } = data;
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(401, 'Invalid credential');
    }

    return {
        id: user.id,
        username: user.username,
        email: user.email,
    };
};

module.exports = {
    registerUser,
    loginUser,
};
