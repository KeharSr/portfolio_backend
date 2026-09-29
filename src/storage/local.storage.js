const fs = require('fs/promises');
const path = require('path');
const { uploadDir } = require('../config/env');

/**
 * Stores files on the local disk under UPLOAD_DIR; app.js serves them at /uploads.
 * To move to S3/Cloudinary later, write another module with the same
 * save/remove/publicPath interface and export it from storage/index.js.
 */
const resolveKey = (key) => {
  const full = path.resolve(uploadDir, key);
  if (!full.startsWith(uploadDir + path.sep)) throw new Error('Invalid storage key');
  return full;
};

const save = async (key, buffer) => {
  const full = resolveKey(key);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, buffer, { flag: 'wx' });
};

const remove = async (key) => {
  await fs.rm(resolveKey(key), { force: true });
};

// Path relative to the API origin.
const publicPath = (key) => `/uploads/${key}`;

module.exports = { save, remove, publicPath };
