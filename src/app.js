const express = require('express');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const path = require('path');
const Joi = require('joi');
const CampgroundModel = require('./models/Campground');
const ExpressError = require('./utils/ExpressError');
const { catchAsync } = require('./utils/catchAsync');
const ReviewModel = require('./models/review');

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

const validateCampground = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        console.log(error.message);
        throw new ExpressError(error.message, 400);
    }
    next();
};

const validateReview = (req, res, next) => {
    const schema = Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        console.log(error.message);
        throw new ExpressError(error.message, 400);
    }
    next();
};

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
    validateCampground,
    catchAsync(async (req, res) => {
        const campground = new CampgroundModel(req.body);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

app.get(
    '/campgrounds/:id',
    catchAsync(async (req, res) => {
        const campground = await CampgroundModel.findById(req.params.id).populate('reviews');
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
    validateCampground,
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

app.post(
    '/campgrounds/:id/reviews',
    validateReview,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await CampgroundModel.findById(id);
        const review = new ReviewModel(req.body);
        campground.reviews.push(review);
        await campground.save();
        await review.save();

        res.redirect(`/campgrounds/${campground._id}`);
    })
);

app.delete(
    '/campgrounds/:id/reviews/:rId',
    catchAsync(async (req, res) => {
        const { id, rId } = req.params;
        await CampgroundModel.findByIdAndUpdate(id, { $pull: { reviews: rId } });
        await ReviewModel.findByIdAndDelete(rId);
        res.redirect(`/campgrounds/${id}`);
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
