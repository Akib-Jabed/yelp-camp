const mongoose = require('mongoose');

function connectDB(url) {
    mongoose.set('strictQuery', false);
    mongoose
        .connect(url)
        .then(() => console.log('database connection successful'))
        .catch((err) => console.error(err));
}

module.exports = connectDB;
