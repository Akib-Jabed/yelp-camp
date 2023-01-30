require('dotenv').config();
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

const dbUser = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbName = process.env.DATABASE_NAME;

const database = process.env.DATABASE_URL.replace('<USER>', dbUser)
    .replace('<PASSWORD>', dbPassword)
    .replace('<DBNAME>', dbName);
mongoose.set('strictQuery', false);
mongoose
    .connect(database)
    .then(() => console.log('Database connected....'))
    .catch((err) => console.err(err));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i += 1) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
        });
        await camp.save();
    }
};

seedDB();
