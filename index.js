const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const dbUser = 'm001-student';
const dbPassword = 'm001-mongodb-basics';
mongoose.set('strictQuery', false);
mongoose
    .connect(
        `mongodb+srv://${dbUser}:${dbPassword}@sandbox.0fk4x.mongodb.net/tourism?retryWrites=true&w=majority`
    )
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
