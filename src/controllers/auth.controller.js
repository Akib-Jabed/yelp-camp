const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { User, Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/tokens');
const tokenTypes = require('../config/tokens');

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

module.exports = {
    register,
    login,
    logout,
};
