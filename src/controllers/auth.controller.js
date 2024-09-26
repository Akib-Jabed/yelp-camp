const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateAuthTokens } = require('../services/token.service');

const register = catchAsync(async (req, res) => {
    const { email } = req.body;
    if (await User.isEmailTaken(email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    const user = await User.create(req.body);
    const tokens = await generateAuthTokens(user);

    res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credential');
    }
    const tokens = await generateAuthTokens(user);
    res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {});

module.exports = {
    register,
    login,
    logout,
};
