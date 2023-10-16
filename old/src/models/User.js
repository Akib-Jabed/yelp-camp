const mongoose = require('mongoose');
const passportLocalMongose = require('passport-local-mongoose');

const { Schema } = mongoose;

const schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

schema.plugin(passportLocalMongose);

const UserModel = mongoose.model('User', schema);

module.exports = UserModel;
