require('dotenv').config();

const required = ['DATABASE_URL', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const path = require('path');

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : '*',
  allowRegistration: process.env.ALLOW_REGISTRATION === 'true',
  // Public base URL of this API, used to build absolute file URLs (e.g. https://api.example.com).
  // When empty, the URL is derived from the incoming request.
  publicUrl: (process.env.PUBLIC_URL || '').replace(/\/+$/, ''),
  uploadDir: path.resolve(process.env.UPLOAD_DIR || 'uploads'),
  maxUploadBytes: (Number(process.env.MAX_UPLOAD_MB) || 5) * 1024 * 1024,
  // When set, uploads go to Cloudinary instead of UPLOAD_DIR.
  cloudinaryUrl: process.env.CLOUDINARY_URL || '',
  cloudinaryFolder: process.env.CLOUDINARY_FOLDER || 'portfolio',
  trustProxy: process.env.TRUST_PROXY === 'true',
};
