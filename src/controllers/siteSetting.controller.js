const { siteSettingService } = require('../services');
const { success } = require('../utils/response');

const list = async (req, res) => {
  const data = req.query.format === 'map' ? await siteSettingService.asMap() : await siteSettingService.list();
  success(res, data);
};

const get = async (req, res) => {
  success(res, await siteSettingService.getByKey(req.params.key));
};

const upsert = async (req, res) => {
  success(res, await siteSettingService.upsert(req.params.key, req.body), 200, 'Setting saved');
};

const bulkUpsert = async (req, res) => {
  success(res, await siteSettingService.bulkUpsert(req.body), 200, 'Settings saved');
};

const remove = async (req, res) => {
  await siteSettingService.remove(req.params.key);
  success(res, null, 200, 'Setting deleted');
};

module.exports = { list, get, upsert, bulkUpsert, remove };
