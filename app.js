const express = require('express');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const { restaurantRouter } = require('./routes/restaurants.routes');
const { usersRouter } = require('./routes/users.routes');
const { mealsRouter } = require('./routes/meals.routes');
const { ordersRouter } = require('./routes/orders.routes');

const { globalErrorHandler } = require('./controllers/error.controllers');

const { AppError } = require('./utils/appError.utils.js');

const app = express();

app.use(express.json());

const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: 'Number of request have been exceded',
});

app.use(limiter);

app.use(helmet());

app.use(compression());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/restaurants', restaurantRouter);
app.use('/api/v1/meals', mealsRouter);
app.use('/api/v1/orders', ordersRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `${req.method} ${req.originalUrl} not found in this server`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = { app };
