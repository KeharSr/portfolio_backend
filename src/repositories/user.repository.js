const BaseRepository = require('./base.repository');

class UserRepository extends BaseRepository {
  constructor() {
    super('user', { defaultOrderBy: { createdAt: 'asc' } });
  }

  findByEmail(email) {
    return this.model.findUnique({ where: { email } });
  }
}

module.exports = new UserRepository();
