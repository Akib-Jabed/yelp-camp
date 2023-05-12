const express = require('express');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const path = require('path');
const CampgroundModel = require('./models/Campground');
const ExpressError = require('./utils/ExpressError');
const { catchAsync } = require('./utils/catchAsync');

mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log('connection successful'))
    .catch((err) => console.error(err));

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get(
    '/campgrounds',
    catchAsync(async (req, res) => {
        const campgrounds = await CampgroundModel.find({});
        res.render('campgrounds/index', { campgrounds });
    })
);

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post(
    '/campgrounds',
    catchAsync(async (req, res) => {
        const campground = new CampgroundModel(req.body);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

app.get(
    '/campgrounds/:id',
    catchAsync(async (req, res) => {
        const campground = await CampgroundModel.findById(req.params.id);
        res.render('campgrounds/show', { campground });
    })
);

app.get(
    '/campgrounds/:id/edit',
    catchAsync(async (req, res) => {
        const campground = await CampgroundModel.findById(req.params.id);
        res.render('campgrounds/edit', { campground });
    })
);

app.put(
    '/campgrounds/:id',
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await CampgroundModel.findByIdAndUpdate(id, { ...req.body });
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

app.delete(
    '/campgrounds/:id',
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await CampgroundModel.findByIdAndDelete(id);
        res.redirect('/campgrounds');
    })
);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render('error', { statusCode, message });
});

module.exports = app;
