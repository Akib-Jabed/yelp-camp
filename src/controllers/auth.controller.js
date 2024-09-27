const httpStatus = require('http-status');
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const { User, Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateAuthTokens } = require('../utils/tokens');

const register = catchAsync(async (req, res) => {
    const { email } = req.body;
    if (await User.isEmailTaken(email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.create([req.body], { session });
        const tokens = generateAuthTokens(user);
        const { token, expires, type } = tokens.refresh;

        // Save refresh token at database
        await Token.create(
            [
                {
                    token,
                    user: user[0].id,
                    expires,
                    type,
                    blacklisted: false,
                },
            ],
            { session }
        );

        await session.commitTransaction();
        res.status(httpStatus.CREATED).send({ user, tokens });
    } catch (err) {
        await session.abortTransaction();
        throw new ApiError(httpStatus.BAD_REQUEST, err);
    } finally {
        session.endSession();
    }
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
