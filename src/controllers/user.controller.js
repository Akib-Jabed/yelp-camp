const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const getUsers = catchAsync(async (req, res) => {
    // const filter = [];
    // const options = [];
    const result = [];
    res.send(result);
});

module.exports = {
    getUsers,
};
