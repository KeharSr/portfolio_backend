const BaseRepository = require('./base.repository');

class CertificationRepository extends BaseRepository {
  constructor() {
    super('certification');
  }
}

module.exports = new CertificationRepository();
