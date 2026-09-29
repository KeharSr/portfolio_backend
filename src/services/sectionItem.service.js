const BaseService = require('./base.service');
const ApiError = require('../utils/ApiError');
const { sectionItemRepository, sectionRepository } = require('../repositories');

class SectionItemService extends BaseService {
  constructor() {
    super(sectionItemRepository, { name: 'Section item' });
  }

  async ensureSection(sectionId, includeHidden) {
    const section = await sectionRepository.findById(sectionId);
    if (!section || (!includeHidden && !section.isVisible)) {
      throw ApiError.notFound('Section not found');
    }
    return section;
  }

  async listBySection(sectionId, { includeHidden = false } = {}) {
    await this.ensureSection(sectionId, includeHidden);
    return this.repository.findMany({
      where: { sectionId, ...(includeHidden ? {} : { isVisible: true }) },
    });
  }

  async getInSection(sectionId, id, { includeHidden = false } = {}) {
    await this.ensureSection(sectionId, includeHidden);
    const item = await this.getById(id, { includeHidden });
    if (item.sectionId !== sectionId) throw ApiError.notFound('Section item not found');
    return item;
  }

  async createInSection(sectionId, data) {
    await this.ensureSection(sectionId, true);
    return this.repository.create({ ...data, sectionId });
  }

  async updateInSection(sectionId, id, data) {
    await this.getInSection(sectionId, id, { includeHidden: true });
    return this.repository.update(id, data);
  }

  async removeInSection(sectionId, id) {
    await this.getInSection(sectionId, id, { includeHidden: true });
    await this.repository.delete(id);
  }

  async reorderInSection(sectionId, items) {
    const existing = await this.listBySection(sectionId, { includeHidden: true });
    const ids = new Set(existing.map((i) => i.id));
    if (items.some((i) => !ids.has(i.id))) {
      throw ApiError.badRequest('All items must belong to this section');
    }
    return this.repository.reorder(items);
  }
}

module.exports = new SectionItemService();
