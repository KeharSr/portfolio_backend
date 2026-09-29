const BaseRepository = require('./base.repository');

class SocialLinkRepository extends BaseRepository {
  constructor() {
    super('socialLink');
  }
}

module.exports = new SocialLinkRepository();
