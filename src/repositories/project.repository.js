const BaseRepository = require('./base.repository');

class ProjectRepository extends BaseRepository {
  constructor() {
    super('project');
  }

  findBySlug(slug) {
    return this.model.findUnique({ where: { slug } });
  }
}

module.exports = new ProjectRepository();
