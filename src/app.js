const express = require('express');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const path = require('path');
// const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');

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
// app.use(flash());

// app.use((req, res, next) => {
//     res.locals.success = req.flash('success');
//     next();
// });

app.get('/', (req, res) => {
    res.render('home');
});

app.use('/campgrounds', require('./routes/campground'));
app.use('/campgrounds/:id/reviews', require('./routes/reviews'));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render('error', { statusCode, message });
});

module.exports = app;
