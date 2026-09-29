const BaseRepository = require('./base.repository');

class ExperienceRepository extends BaseRepository {
  constructor() {
    super('experience');
  }
}

module.exports = new ExperienceRepository();
