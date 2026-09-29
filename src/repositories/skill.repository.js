const BaseRepository = require('./base.repository');

class SkillRepository extends BaseRepository {
  constructor() {
    super('skill');
  }
}

module.exports = new SkillRepository();
