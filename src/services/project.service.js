const BaseService = require('./base.service');
const ApiError = require('../utils/ApiError');
const uniqueSlug = require('./uniqueSlug');
const { projectRepository } = require('../repositories');

class ProjectService extends BaseService {
  constructor() {
    super(projectRepository, { name: 'Project', filterableFields: ['category', 'isFeatured'] });
  }

  async prepareData(data, existing) {
    const result = { ...data };
    if (data.slug || (!existing && data.title)) {
      result.slug = await uniqueSlug(this.repository, data.slug || data.title, existing?.id);
    }
    return result;
  }

  async getBySlug(slug, { includeHidden = false } = {}) {
    const project = await this.repository.findBySlug(slug);
    if (!project || (!includeHidden && !project.isVisible)) {
      throw ApiError.notFound('Project not found');
    }
    return project;
  }
}

module.exports = new ProjectService();
