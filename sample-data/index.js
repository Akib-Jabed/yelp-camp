const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const CampgroundModel = require('../src/models/Campground');
dotenv.config();

mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log('connection successful'))
    .catch((err) => console.error(err));

const importData = async () => {
    try {
        const campgrounds = JSON.parse(
            fs.readFileSync(`${__dirname}/data.json`, 'utf-8'),
        );
        await CampgroundModel.deleteMany();
        await CampgroundModel.create(campgrounds);
    } catch (error) {
        console.log(error);
    }
    process.exit()
};

importData();
