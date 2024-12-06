const httpStatus = require('http-status');
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const { User, Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/tokens');

const getAccountInfo = catchAsync(async (req, res) => {
    const user = await User.find({ _id: req.user.id }).select({
        id: 1,
        firstName: 1,
        lastName: 1,
        fullName: 1,
        email: 1,
        photo: 1,
        role: 1,
    });
    res.status(httpStatus.OK).send(user);
});

const updateAccountInfo = catchAsync(async (req, res) => {
    try {
        await User.findOneAndUpdate({ _id: req.user.id }, req.body);
        return res.status(httpStatus.OK).send({ message: 'Account information successfully updated' });
    } catch (err) {
        throw new ApiError(500, 'Something Went Wrong', false);
    }
});

const deactivateAccount = catchAsync(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await User.findOneAndUpdate({ _id: req.user.id }, { active: false }, { session });
        await Token.create(
            [
                {
                    token: req.token,
                    user: req.user.id,
                    blacklisted: true,
                },
            ],
            { session }
        );

        await session.commitTransaction();
        return res.status(httpStatus.OK).send({ message: 'Account successfully deactivated' });
    } catch (err) {
        await session.abortTransaction();
        throw new ApiError(500, 'Something Went Wrong', false);
    } finally {
        session.endSession();
    }
});

const updatePassword = catchAsync(async (req, res) => {});

module.exports = {
    getAccountInfo,
    updateAccountInfo,
    deactivateAccount,
    updatePassword,
};
