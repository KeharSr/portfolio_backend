const BaseRepository = require('./base.repository');

class ContactMessageRepository extends BaseRepository {
  constructor() {
    super('contactMessage', { defaultOrderBy: { createdAt: 'desc' } });
  }
}

module.exports = new ContactMessageRepository();
