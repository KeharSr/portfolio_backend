const BaseRepository = require('./base.repository');

class SectionRepository extends BaseRepository {
  constructor() {
    super('section');
  }

  findBySlug(slug, { include } = {}) {
    return this.model.findUnique({ where: { slug }, include });
  }
}

module.exports = new SectionRepository();
