const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const env = require('./config/env');
const routes = require('./routes');
const { globalLimiter } = require('./middleware/rateLimit.middleware');
const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');

const app = express();

if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply global rate limiting to all /api routes
app.use('/api', globalLimiter, routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
