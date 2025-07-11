# Security Best Practice:

#### \* Don't use deprecated or vulnerable versions of express

#### \* Use TLS(Transport Layer Security) for secure data transmission. Recommended way: use Nginx

#### \* Always check/validate user input. Sanitize user input and use ORM/ODM or parameterized query

#### \* Use Helmet. Helmet will set security-related HTTP response header to protect application from some well-known web vulnerabilities

```
const helmet = require('helmet')
app.use(helmet())
```

#### \* Leaking server inforamtion. example: X-Powered-By:Express. disable the header

```
app.disable('x-powered-by')
```

Also try to use custom error handler. For production use static message instead of displaying error stack.

```
app.use((req, res, next) => {
   res.status(404).send("Sorry can't find that!")
})

app.use((err, req, res, next) => {
   console.error(err.stack)
   res.status(500).send("Something went wrong!")
})
```

#### \* Use cookies securely.

-> use session storage to store session data and saves only the id in the cookie (express-session) <br>
-> cookie-backed storage where the entire session is serialized in the cookie (cookie-session)

#### \* Don't use default session cookie name

```
const session = require('express-session')
app.set('trust proxy', 1) // trust first proxy
app.use(session({
   secret: 's3Cur3',
   name: 'sessionId'
}))
```

#### \* Set cookie security options

-> secure <br>
-> httpOnly <br>
-> domain <br>
-> path <br>
-> expires <br>

```
const session = require('cookie-session')
const express = require('express')
const app = express()

const expiryDate = new Date(Date.now() + 60 _ 60 _ 1000) // 1 hour
app.use(session({
   name: 'session',
   keys: ['key1', 'key2'],
   cookie: {
      secure: true,
      httpOnly: true,
      domain: 'example.com',
      path: 'foo/bar',
      expires: expiryDate
   }
}))
```

#### \* Prevent brute-force attacks against authorization (rate limit). If Nginx is used then use rate limiting in Nginx instead of express app

#### \* Prevent brute-force attacks by limiting body payload size. use body-parser

#### \* Authentication limits. block ip address after certain number of login attempts or use two-way authentication

#### \* Block JWT token after logout or if user ensure this is not he/she

#### \* Encrypt password instead of store in pain text

#### \* Ensure dependencies are secure. Check critical security vulnerabilities that could affect application by auditing or use `synk`

```
npm audit
npm audit fix
```

#### \* Using escape function in a template engine ensure that data is displayed safely

```
const templateEngine = require('template-engine');
const escape = require('escape-html');

app.get('/page', (req, res) => {
const userGeneratedContent = getUserGeneratedContent();

// Escaping user-generated content before rendering
const escapedContent = escape(userGeneratedContent);

res.render('page', { content: escapedContent });
});
```

#### \* Run Node.js as a non-root user

#### \* use eslint-plugin-security to identify potential security hotspots

#### \* Maintain secure logging and monitoring


# YelpCamp API - Express Backend

![Node.js](https://img.shields.io/badge/Node.js-v16.x-green)
![Express](https://img.shields.io/badge/Express-v4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-5.x-brightgreen)
![JWT](https://img.shields.io/badge/JWT-Auth-blue)

A robust Express.js backend API for a YelpCamp-style campground review application, featuring comprehensive security, logging, testing, and image processing capabilities.

## Features

- **RESTful API** for campgrounds, reviews, and users
- **MongoDB** with Mongoose for data persistence
- **JWT Authentication** with secure token handling
- **Winston Logger** for production-grade logging
- **Rate Limiting** and **Speed Limiting** for API protection
- **Request Sanitization** against NoSQL injection and XSS
- **Mongo Query Sanitization** for security
- **Graceful Shutdown** handling SIGTERM and SIGINT
- **Joi Validation** for request payloads
- **Image Upload** with Multer and Sharp processing
- **Comprehensive Testing** with Jest and Supertest
- **Error Handling** centralized middleware
- **Environment Configuration** with dotenv
- **Security Best Practices** implemented

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/yelpcamp-api.git
cd yelpcamp-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your environment variables:
```env
MONGODB_URI=mongodb://localhost:27017/yelpcamp
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
PORT=3000
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
FILE_UPLOAD_PATH=./public/uploads
FILE_UPLOAD_MAX_SIZE=1000000
```

4. Start the development server:
```bash
npm run dev
```

## API Documentation

The API documentation is available via Swagger UI when running the server:
`http://localhost:3000/api-docs`

### Main Endpoints

- **Auth**: `/api/v1/auth` (Register, Login, Logout)
- **Users**: `/api/v1/users` (User management)
- **Campgrounds**: `/api/v1/campgrounds` (CRUD operations)
- **Reviews**: `/api/v1/reviews` (Campground reviews)

## Project Structure

```
├── config/               # Configuration files
│   ├── db.js             # Database connection
│   ├── logger.js         # Winston logger setup
│   └── rateLimiter.js    # Rate limiting config
├── controllers/          # Route controllers
├── middleware/           # Custom middleware
│   ├── auth.js           # Authentication
│   ├── error.js          # Error handling
│   └── sanitize.js       # Sanitization
├── models/               # Mongoose models
├── routes/               # Express routes
├── services/             # Business logic
├── utils/                # Utility functions
├── validators/           # Joi validation schemas
├── tests/                # Test suites
├── uploads/              # Image uploads (created at runtime)
├── app.js                # Express app setup
├── server.js             # Server initialization
└── README.md             # Project documentation
```

## Security Features

1. **Helmet** for secure HTTP headers
2. **CORS** with whitelisted origins
3. **Express Rate Limit** and **Express Slow Down**
4. **Mongo Sanitize** for query sanitization
5. **XSS Clean** middleware
6. **HTTP Parameter Pollution** protection
7. **JWT** with secure cookie options
8. **Password hashing** with bcrypt

## Testing

The API includes comprehensive test coverage with Jest and Supertest:

```bash
npm test        # Run all tests
npm run test:watch  # Watch mode
npm run test:cov    # Test coverage
```

## Production Setup

1. Build and run with PM2:
```bash
npm install -g pm2
pm2 start server.js --name yelpcamp-api
```

2. Set up Nginx as reverse proxy (recommended)

3. Configure SSL/TLS (recommended)

## Logging

The application uses Winston with daily rotating files:
- Logs are stored in `/logs/`
- Different levels for development and production
- Unhandled exceptions and rejections are logged

## Image Processing

- Uploads are processed with Multer
- Images are optimized with Sharp (resized, converted to webp)
- Stored in `/public/uploads/`
- Protected against malicious files

## Graceful Shutdown

The application properly handles:
- SIGTERM (Heroku, Kubernetes)
- SIGINT (Ctrl+C)
- Unhandled rejections
- Uncaught exceptions

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | Secret for signing JWT tokens | - |
| `JWT_EXPIRE` | Token expiration time | 30d |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Application environment | development |
| `RATE_LIMIT_WINDOW` | Rate limit window (minutes) | 15 |
| `RATE_LIMIT_MAX` | Max requests per window | 100 |
| `FILE_UPLOAD_PATH` | Path for file uploads | ./public/uploads |
| `FILE_UPLOAD_MAX_SIZE` | Max file size in bytes | 1000000 |

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)