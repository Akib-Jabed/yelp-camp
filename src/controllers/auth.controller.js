const httpStatus = require('http-status');
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const { User, Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateAuthTokens, storeTokenToCookie } = require('../utils/tokens');

const register = catchAsync(async (req, res) => {
    const { email } = req.body;
    if (await User.isEmailTaken(email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.create([req.body], { session });
        user[0].password = undefined;
        const userId = user[0].id;
        const tokens = generateAuthTokens(userId);
        const { token, expires, type } = tokens.refresh;
        // Save refresh token at database
        await Token.create(
            [
                {
                    token,
                    user: userId,
                    expires,
                    type,
                    blacklisted: false,
                },
            ],
            { session }
        );

        await session.commitTransaction();
        storeTokenToCookie(res, tokens.access.token, tokens.access.expires);
        res.status(httpStatus.CREATED).send({ user, token: tokens.access });
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

    const userId = user.id;
    const tokens = await generateAuthTokens(userId);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { token, expires, type } = tokens.refresh;

        await Token.deleteOne({ user: userId, type: 'refresh' }).session(session);

        await Token.create(
            [
                {
                    token,
                    user: userId,
                    expires,
                    type,
                    blacklisted: false,
                },
            ],
            { session }
        );

        await session.commitTransaction();

        storeTokenToCookie(res, tokens.access.token, tokens.access.expires);

        user.password = undefined;

        res.send({ user, token: tokens.access });
    } catch (err) {
        await session.abortTransaction();
        throw new ApiError(httpStatus.BAD_REQUEST, err);
    } finally {
        session.endSession();
    }
});

const logout = catchAsync(async (req, res) => {});

module.exports = {
    register,
    login,
    logout,
};
