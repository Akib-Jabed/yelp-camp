const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { User } = require('../models');

const getUsers = catchAsync(async (req, res) => {
    const users = await User.find().select({
        id: 1,
        firstName: 1,
        lastName: 1,
        fullName: 1,
        email: 1,
        photo: 1,
        role: 1,
    });
    res.status(httpStatus.OK).send(users);
});

module.exports = {
    getUsers,
};
