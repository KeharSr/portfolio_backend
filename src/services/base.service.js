const ApiError = require('../utils/ApiError');

const parseQueryValue = (value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
};

/**
 * Generic business-logic layer. Knows nothing about HTTP;
 * delegates persistence to a repository.
 */
class BaseService {
  constructor(repository, { name = 'Resource', filterableFields = [], hasVisibility = true } = {}) {
    this.repository = repository;
    this.name = name;
    this.filterableFields = filterableFields;
    this.hasVisibility = hasVisibility;
  }

  buildWhere(query = {}, includeHidden = false) {
    const where = {};
    for (const field of this.filterableFields) {
      if (query[field] !== undefined && query[field] !== '') {
        where[field] = parseQueryValue(query[field]);
      }
    }
    if (this.hasVisibility && !includeHidden) where.isVisible = true;
    return where;
  }

  // Hook for subclasses to normalise data before create/update.
  // eslint-disable-next-line no-unused-vars
  async prepareData(data, existing) {
    return data;
  }

  list({ query, includeHidden = false } = {}) {
    return this.repository.findMany({ where: this.buildWhere(query, includeHidden) });
  }

  async getById(id, { includeHidden = false } = {}) {
    const record = await this.repository.findById(id);
    if (!record || (this.hasVisibility && !includeHidden && !record.isVisible)) {
      throw ApiError.notFound(`${this.name} not found`);
    }
    return record;
  }

  async create(data) {
    return this.repository.create(await this.prepareData(data, null));
  }

  async update(id, data) {
    const existing = await this.getById(id, { includeHidden: true });
    return this.repository.update(id, await this.prepareData(data, existing));
  }

  async remove(id) {
    await this.getById(id, { includeHidden: true });
    await this.repository.delete(id);
  }

  async reorder(items) {
    return this.repository.reorder(items);
  }
}

module.exports = BaseService;
