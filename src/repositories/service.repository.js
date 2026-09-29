const BaseRepository = require('./base.repository');

class ServiceRepository extends BaseRepository {
  constructor() {
    super('service');
  }
}

module.exports = new ServiceRepository();
