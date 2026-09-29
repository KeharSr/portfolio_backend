const { profileService } = require('../services');
const { success } = require('../utils/response');

const get = async (req, res) => {
  success(res, await profileService.get());
};

const upsert = async (req, res) => {
  success(res, await profileService.upsert(req.body), 200, 'Profile saved');
};

module.exports = { get, upsert };
