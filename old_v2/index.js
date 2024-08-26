const app = require('./src/app');
const config = require('./config');

const { port } = config;

app.listen(port, () => console.log(`listening on port:  ${port}`));
