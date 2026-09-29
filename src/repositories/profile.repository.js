const BaseRepository = require('./base.repository');

class ProfileRepository extends BaseRepository {
  constructor() {
    super('profile', { defaultOrderBy: { createdAt: 'asc' } });
  }

  // The portfolio has a single profile row.
  findFirst() {
    return this.model.findFirst({ orderBy: { createdAt: 'asc' } });
  }
}

module.exports = new ProfileRepository();
