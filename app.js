const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

//Controllers

const { globalErrorHandler } = require('./controller/errors.controllers');

// Routers
const { usersRouter } = require('./routes/users.routs');
const { repairsRouter } = require('./routes/repairs.routs');
const { commentsRouter } = require('./routes/comments.routes');
const { viewsRouter } = require('./routes/views.routes');
// init express app
const app = express();

// Enable CORS
app.use(cors());

// Enable incoming JSON data
app.use(express.json());

// Enable incoming From-Data
app.use(express.urlencoded({ extended: true }));

// Set pug as template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Enable static assets
app.use(express.static('public'));

// Add security helmet
app.use(helmet());

// Compress responses
app.use(compression());

// Log incomig requests morgan
if (process.env.NODE_ENV == 'development') app.use(morgan('dev'));
else app.use(morgan('combined'));
//Limit IP requests

const limiter = rateLimit({
  max: 10,
  windowMs: 60 * 1000,
  message: 'too many requests from this IP',
});

app.use(limiter);

// Endpoints

app.use('/', viewsRouter);

//http://localhost:4001/api/v1/users
app.use('/api/v1/users', usersRouter);

//http://localhost:4001/api/v1/repairs
app.use('/api/v1/repairs', repairsRouter);

//http://localhost:4001/api/v1/comments
app.use('/api/v1/comments', commentsRouter);

// Global error handler
app.use('*', globalErrorHandler);

module.exports = { app };
