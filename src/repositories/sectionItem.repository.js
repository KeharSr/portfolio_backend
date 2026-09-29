const BaseRepository = require('./base.repository');

class SectionItemRepository extends BaseRepository {
  constructor() {
    super('sectionItem');
  }
}

module.exports = new SectionItemRepository();
