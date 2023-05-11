const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const CampgroundModel = require('./models/Campground');

mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log('connection successful'))
    .catch((err) => console.error(err));

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await CampgroundModel.find({});
    res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await CampgroundModel.findById(req.params.id);
    res.render('campgrounds/show', { campground });
});

app.post('/', async (req, res) => {
    const campground = new CampgroundModel({ title: 'My backyard' });
    await campground.save();

    res.send(campground);
});

module.exports = app;
