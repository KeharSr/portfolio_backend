const BaseService = require('./base.service');
const ApiError = require('../utils/ApiError');
const uniqueSlug = require('./uniqueSlug');
const { sectionRepository } = require('../repositories');

const itemsInclude = (includeHidden) => ({
  items: {
    where: includeHidden ? {} : { isVisible: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  },
});

class SectionService extends BaseService {
  constructor() {
    super(sectionRepository, { name: 'Section', filterableFields: ['type'] });
  }

  async prepareData(data, existing) {
    const result = { ...data };
    if (data.slug || (!existing && data.title)) {
      result.slug = await uniqueSlug(this.repository, data.slug || data.title, existing?.id);
    }
    return result;
  }

  list({ query, includeHidden = false } = {}) {
    return this.repository.findMany({
      where: this.buildWhere(query, includeHidden),
      include: itemsInclude(includeHidden),
    });
  }

  async getById(id, { includeHidden = false } = {}) {
    const section = await this.repository.findById(id, { include: itemsInclude(includeHidden) });
    if (!section || (!includeHidden && !section.isVisible)) {
      throw ApiError.notFound('Section not found');
    }
    return section;
  }

  async getBySlug(slug, { includeHidden = false } = {}) {
    const section = await this.repository.findBySlug(slug, { include: itemsInclude(includeHidden) });
    if (!section || (!includeHidden && !section.isVisible)) {
      throw ApiError.notFound('Section not found');
    }
    return section;
  }
}

module.exports = new SectionService();
