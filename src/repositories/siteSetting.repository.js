const BaseRepository = require('./base.repository');

class SiteSettingRepository extends BaseRepository {
  constructor() {
    super('siteSetting', { defaultOrderBy: { key: 'asc' } });
  }

  findByKey(key) {
    return this.model.findUnique({ where: { key } });
  }

  upsertByKey(key, data) {
    return this.model.upsert({
      where: { key },
      create: { key, ...data },
      update: data,
    });
  }

  deleteByKey(key) {
    return this.model.delete({ where: { key } });
  }
}

module.exports = new SiteSettingRepository();
