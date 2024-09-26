const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
    const filter = [];
    const options = [];
    const result = await userService.queryUsers(filter, options);
    res.send(result);
});

module.exports = {
    createUser,
    getUsers,
};
