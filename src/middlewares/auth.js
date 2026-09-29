const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const ApiError = require('../utils/ApiError');

const extractUser = (req) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    return undefined; // token present but invalid
  }
};

// Requires a valid admin token.
const requireAuth = (req, res, next) => {
  const user = extractUser(req);
  if (!user) return next(ApiError.unauthorized('Invalid or missing token'));
  req.user = user;
  next();
};

// Attaches the user if a valid token is present; public requests pass through.
const optionalAuth = (req, res, next) => {
  const user = extractUser(req);
  if (user) req.user = user;
  next();
};

module.exports = { requireAuth, optionalAuth };
