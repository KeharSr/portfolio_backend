const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const { cloudinaryUrl, cloudinaryFolder } = require('../config/env');

/**
 * Stores files on Cloudinary, so they survive redeploys and work from any host.
 * Enabled when CLOUDINARY_URL is set (see storage/index.js).
 * Same save/remove/publicPath interface as local.storage.js, but publicPath
 * returns an absolute https URL.
 */
cloudinary.config({ cloudinary_url: cloudinaryUrl, secure: true, urlAnalytics: false });

// Cloudinary serves PDFs as "raw" files (images-only accounts block PDF delivery);
// everything else is an image whose public id is the key without its extension.
const target = (key) => {
  const ext = path.extname(key).slice(1);
  const base = `${cloudinaryFolder}/${key}`;
  return ext === 'pdf'
    ? { publicId: base, resourceType: 'raw' }
    : { publicId: base.slice(0, -(ext.length + 1)), resourceType: 'image', format: ext };
};

const save = (key, buffer) => {
  const { publicId, resourceType } = target(key);
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { public_id: publicId, resource_type: resourceType, overwrite: false },
        (err, result) => (err ? reject(err) : resolve(result)),
      )
      .end(buffer);
  });
};

const remove = async (key) => {
  const { publicId, resourceType } = target(key);
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
};

const publicPath = (key) => {
  const { publicId, resourceType, format } = target(key);
  return cloudinary.url(publicId, { resource_type: resourceType, format, secure: true });
};

module.exports = { save, remove, publicPath };
