const prisma = require('../config/prisma');

/**
 * Generic data-access layer around a Prisma model delegate.
 * Only this layer talks to Prisma directly.
 */
class BaseRepository {
  constructor(modelName, { defaultOrderBy = [{ order: 'asc' }, { createdAt: 'desc' }] } = {}) {
    this.prisma = prisma;
    this.modelName = modelName;
    this.model = prisma[modelName];
    this.defaultOrderBy = defaultOrderBy;
  }

  findMany({ where = {}, orderBy = this.defaultOrderBy, include, skip, take } = {}) {
    return this.model.findMany({ where, orderBy, include, skip, take });
  }

  count(where = {}) {
    return this.model.count({ where });
  }

  findById(id, { include } = {}) {
    return this.model.findUnique({ where: { id }, include });
  }

  findOne(where, { include } = {}) {
    return this.model.findFirst({ where, include });
  }

  create(data, { include } = {}) {
    return this.model.create({ data, include });
  }

  update(id, data, { include } = {}) {
    return this.model.update({ where: { id }, data, include });
  }

  delete(id) {
    return this.model.delete({ where: { id } });
  }

  // items: [{ id, order }]
  reorder(items) {
    return this.prisma.$transaction(
      items.map(({ id, order }) => this.model.update({ where: { id }, data: { order } })),
    );
  }
}

module.exports = BaseRepository;
