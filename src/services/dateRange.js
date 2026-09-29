const ApiError = require('../utils/ApiError');

// Shared rules for records with a start/end date and an "isCurrent" flag.
const normaliseDateRange = (data, existing) => {
  const merged = { ...(existing || {}), ...data };
  const result = { ...data };

  if (merged.isCurrent) result.endDate = null;

  const start = merged.startDate ? new Date(merged.startDate) : null;
  const end = result.endDate === null ? null : merged.endDate ? new Date(merged.endDate) : null;
  if (start && end && end < start) {
    throw ApiError.badRequest('endDate must be after startDate');
  }
  return result;
};

module.exports = normaliseDateRange;
