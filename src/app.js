const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { corsOrigin, nodeEnv, uploadDir, trustProxy } = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Behind a reverse proxy (Render, Railway, Nginx...) so req.protocol is https for file URLs.
if (trustProxy) app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '1mb' }));
if (nodeEnv !== 'test') app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));

// Uploaded images/icons/avatars/resume. File names are random UUIDs, so they can be cached forever.
app.use(
  '/uploads',
  cors({ origin: '*' }),
  (req, res, next) => {
    // Allow the frontend (different origin) to embed these files.
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    // If an SVG is opened directly, block any script in it.
    res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  },
  express.static(path.resolve(uploadDir), {
    immutable: true,
    maxAge: '365d',
    index: false,
    dotfiles: 'deny',
    fallthrough: false,
  }),
);

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
