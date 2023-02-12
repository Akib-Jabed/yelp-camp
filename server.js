const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./src/utils/express-error');
const asyncCatch = require('./src/utils/async-catch');
const { campgroundSchema } = require('./src/schema');
const Campground = require('./src/models/campground');

dotenv.config();

const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

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

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400);
    } else {
        next();
    }
};

app.get('/', (req, res) => {
    res.render('home');
});

app.get(
    '/campgrounds',
    asyncCatch(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
    }),
);

app.get('/campgrounds/new', async (_, res) => {
    res.render('campgrounds/new');
});

app.post(
    '/campgrounds',
    validateCampground,
    asyncCatch(async (req, res) => {
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    }),
);

app.get(
    '/campgrounds/:id',
    asyncCatch(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/show', { campground });
    }),
);

app.get(
    '/campgrounds/:id/edit',
    asyncCatch(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/edit', { campground });
    }),
);

app.put(
    '/campgrounds/:id',
    validateCampground,
    asyncCatch(async (req, res) => {
        const { id } = req.params;
        console.log(req.body);
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        res.redirect(`/campgrounds/${campground._id}`);
    }),
);

app.delete(
    '/campgrounds/:id',
    asyncCatch(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        res.redirect('/campgrounds');
    }),
);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = 'Oh!! Something Went Wrong';
    }
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('Serving on port 3000....');
});
