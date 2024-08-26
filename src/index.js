const app = require('./app');
const config = require('./config/config');
const connectDB = require('./mongo');

app.listen(config.port, () => {
    connectDB(config.database.url);
    console.log(`listening on port: ${config.port}`);
});
