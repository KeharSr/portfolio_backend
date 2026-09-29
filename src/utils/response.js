const success = (res, data, statusCode = 200, message) =>
  res.status(statusCode).json({ success: true, message, data });

module.exports = { success };
