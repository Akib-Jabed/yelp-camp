const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const Campground = require('./src/models/campground');

dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

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

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'Connection error:'));
// db.once('open', () => {
//     console.log('Database connected!!!');
// });

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/:id', async (req, res, id) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
});

app.get('/make', async (req, res) => {
    const camp = new Campground({
        title: 'My Yard',
        description: 'cheap',
    });
    await camp.save();
    res.send(camp);
});

app.listen(3000, () => {
    console.log('Serving on port 3000....');
});
