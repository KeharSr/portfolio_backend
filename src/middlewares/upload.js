const multer = require('multer');
const { maxUploadBytes } = require('../config/env');
const ApiError = require('../utils/ApiError');
const { ALLOWED_MIME_TYPES } = require('../utils/fileType');

const MAX_FILES = 10;

// Files are kept in memory so the service can check their real type before anything touches disk.
const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxUploadBytes, files: MAX_FILES, fields: 20 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(ApiError.badRequest(`Unsupported file type: ${file.mimetype}`));
    }
    cb(null, true);
  },
}).fields([
  { name: 'file', maxCount: 1 },
  { name: 'files', maxCount: MAX_FILES },
]);

// Accepts multipart/form-data with a "file" field and/or a "files" field.
// Puts the files in req.uploadedFiles.
const upload = (req, res, next) => {
  multerUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ApiError(413, `File too large (max ${Math.round(maxUploadBytes / 1024 / 1024)} MB)`));
      }
      return next(ApiError.badRequest(err.message));
    }
    if (err) return next(err);

    req.uploadedFiles = [...(req.files?.file || []), ...(req.files?.files || [])];
    if (req.uploadedFiles.length === 0) {
      return next(ApiError.badRequest('No file uploaded. Use the "file" or "files" form field.'));
    }
    next();
  });
};

module.exports = upload;
