const BaseRepository = require('./base.repository');

class MediaRepository extends BaseRepository {
  constructor() {
    super('media', { defaultOrderBy: { createdAt: 'desc' } });
  }
}

module.exports = new MediaRepository();
