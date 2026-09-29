const BaseRepository = require('./base.repository');

class EducationRepository extends BaseRepository {
  constructor() {
    super('education');
  }
}

module.exports = new EducationRepository();
