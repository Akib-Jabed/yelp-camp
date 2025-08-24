# YelpCamp API - Express Backend

![Node.js](https://img.shields.io/badge/Node.js-v24.x-green)
![Express](https://img.shields.io/badge/Express-v4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-brightgreen)
![JWT](https://img.shields.io/badge/JWT-Auth-blue)
![Jest](https://img.shields.io/badge/Jest-Testing-red)

A robust Express.js backend API for a YelpCamp-style campground review application, featuring comprehensive security, logging, testing, and image processing capabilities.

## Installation

Clone the repository:
```bash
git clone git@github.com:Akib-Jabed/yelp-camp.git
cd yelp-camp
```

Create a `.env` file in the root directory with your environment variables:
```env
ENVIRONMENT=
PORT=
DATABASE_URL=
SECRET_KEY=
```

### Option 1: Local Development Setup
Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

### Option 02: Docker Setup
Build and start the containers:
```
docker-compose up --build 
```

To run the containers in detached mode (in the background):
```
docker-compose up -d 
```

## Project Structure

```
├── .dockerignore                      # Docker ignore file
├── .eslintignore                      # ESLint ignore patterns
├── .eslintrc.json                     # ESLint configuration
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore patterns
├── docker-compose.yml                 # Docker composition for services
├── Dockerfile                         # Docker image build instructions
├── index.js                           # Application entry point
├── jest.config.js                     # Jest testing framework configuration
├── package.json                       # Project dependencies and scripts
├── package-lock.json                  # NPM package lock file
├── Yelp Camp.postman_collection.json  # Postman collection
│
├── 📁 src/                            # Source code directory
│   │
│   ├── app.js                         # Express app configuration
│   │
│   ├── 📁 config/                     # Configuration files
│   │   ├── config.js                  # Application configuration
│   │   └── logger.js                  # Logger configuration
│   │
│   ├── 📁 controllers/                # Route handlers (MVC Controllers)
│   │   ├── auth.controller.js
│   │   ├── campground.controller.js
│   │   ├── review.controller.js
│   │   └── index.js                   # Controller exports
│   │
│   ├── 📁 docs/                       # API documentation
│   │   ├── components.yml             # Reusable API components
│   │   └── responses.yml              # Common API responses
│   │
│   ├── 📁 middlewares/                # Custom Express middleware functions
│   │   ├── auth.js                    # Authentication & authorization
│   │   ├── error.js                   # Global error handling
│   │   ├── fileUploader.js            # File upload handling (Multer & Sharp)
│   │   └── validate.js                # Request validation middleware
│   │
│   ├── 📁 models/                     # MongoDB/Mongoose ODM schemas & models
│   │   ├── user.model.js
│   │   ├── campground.model.js
│   │   ├── review.model.js
│   │   └── index.js                   # Model exports
│   │
│   ├── 📁 routes/                     # Express route definitions
│   │   ├── auth.route.js
│   │   ├── campground.route.js
│   │   ├── review.route.js
│   │   ├── docs.route.js              # API documentation routes (Swagger)
│   │   └── index.js                   # Central route loader
│   │
│   ├── 📁 services/                   # Business logic layer
│   │   ├── auth.service.js
│   │   ├── campground.service.js
│   │   ├── review.service.js
│   │   └── index.js                   # Service exports
│   │
│   ├── 📁 utils/                      # Helper modules and utilities
│   │   ├── ApiError.js                # Custom error class
│   │   ├── ApiFeatures.js             # Filtering, sorting and pagination
│   │   ├── catchAsync.js              # Utility for async error handling
│   │   └── tokens.js                  # JWT token generation
│   │
│   └── 📁 validations/                # Request validation schemas (Joi)
│       ├── auth.validation.js
│       ├── campground.validation.js
│       ├── review.validation.js
│       └── index.js                   # Validation schema exports
│
├── 📁 tests/                          # Test suites (Jest & Supertest)
│   ├── integration/
│   └── unit/
│
└── README.md                          # Project documentation
```

## API Documentation

The API documentation is available via Swagger UI when running the server:
`/api/docs`

### Main Endpoints

- **Auth**: `/api/auth` (Register, Login, Logout)
- **Campgrounds**: `/api/campgrounds` (Campground CRUD operations)
- **Reviews**: `/api/campgrounds/:campgroundId/reviews` (Campground reviews)