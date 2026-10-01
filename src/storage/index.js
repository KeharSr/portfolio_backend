const { cloudinaryUrl } = require('../config/env');

// Cloudinary when configured (needed on hosts with temporary disks, like Render), else local disk.
module.exports = cloudinaryUrl ? require('./cloudinary.storage') : require('./local.storage');
