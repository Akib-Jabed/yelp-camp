const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const { User, Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/tokens');
const tokenTypes = require('../config/tokens');
const { sendResetPasswordMail } = require('../utils/email');
const config = require('../config/config');

const register = catchAsync(async (req, res) => {
    const { email } = req.body;
    if (await User.isEmailTaken(email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    const user = await User.create(req.body);
    user[0].password = undefined;

    const token = generateToken(user[0]);

    res.status(httpStatus.CREATED).send({ user, token });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credential');
    }

    user.password = undefined;
    const token = generateToken(user);

    res.status(httpStatus.OK).send({ user, token });
});

const logout = catchAsync(async (req, res) => {
    const { token, user } = req;

    await Token.create({ token, user: user.id, type: tokenTypes.ACCESS, blacklisted: true });

    res.status(200).send();
});

const forgetPassword = catchAsync(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, 'No user found with this email');
    }

    const token = generateToken(user, '1h');
    await Token.create({ token, user: user.id, type: tokenTypes.RESET_PASSWORD });
    await sendResetPasswordMail(email, token);
    res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
    const { token } = req.query;
    const { password } = req.body;

    const decoded = jwt.verify(token, config.jwt.secret);
    if (!decoded) {
        throw new ApiError(403, 'Token expired.');
    }

    const tokenDoc = await Token.findOne({
        token,
        type: tokenTypes.RESET_PASSWORD,
        user: decoded.data.id,
        blacklisted: false,
    });
    if (!tokenDoc) {
        throw new Error('Token not found');
    }

    const user = await User.findById(decoded.data.id);
    if (!user) {
        throw new ApiError(404, 'No user found');
    }

    try {
        user.password = password;
        await user.save();
        res.status(httpStatus.OK).send('Password reset successful');
    } catch (e) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
});

module.exports = {
    register,
    login,
    logout,
    forgetPassword,
    resetPassword,
};
