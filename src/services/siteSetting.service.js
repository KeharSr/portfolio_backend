const ApiError = require('../utils/ApiError');
const { siteSettingRepository } = require('../repositories');

class SiteSettingService {
  list() {
    return siteSettingRepository.findMany();
  }

  // { heroTitle: "...", footerText: "..." }
  async asMap() {
    const settings = await siteSettingRepository.findMany();
    return Object.fromEntries(settings.map((s) => [s.key, s.value]));
  }

  async getByKey(key) {
    const setting = await siteSettingRepository.findByKey(key);
    if (!setting) throw ApiError.notFound(`Setting "${key}" not found`);
    return setting;
  }

  upsert(key, { value, description }) {
    return siteSettingRepository.upsertByKey(key, { value, description });
  }

  async bulkUpsert(entries) {
    return Promise.all(
      Object.entries(entries).map(([key, value]) => siteSettingRepository.upsertByKey(key, { value })),
    );
  }

  async remove(key) {
    await this.getByKey(key);
    await siteSettingRepository.deleteByKey(key);
  }
}

module.exports = new SiteSettingService();
