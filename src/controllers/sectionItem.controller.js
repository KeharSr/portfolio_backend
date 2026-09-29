const BaseController = require('./base.controller');
const { sectionItemService } = require('../services');
const { success } = require('../utils/response');

const service = sectionItemService;

const list = async (req, res) => {
  const data = await service.listBySection(req.params.sectionId, {
    includeHidden: BaseController.includeHidden(req),
  });
  success(res, data);
};

const getById = async (req, res) => {
  const data = await service.getInSection(req.params.sectionId, req.params.id, {
    includeHidden: BaseController.includeHidden(req),
  });
  success(res, data);
};

const create = async (req, res) => {
  success(res, await service.createInSection(req.params.sectionId, req.body), 201, 'Section item created');
};

const update = async (req, res) => {
  const data = await service.updateInSection(req.params.sectionId, req.params.id, req.body);
  success(res, data, 200, 'Section item updated');
};

const remove = async (req, res) => {
  await service.removeInSection(req.params.sectionId, req.params.id);
  success(res, null, 200, 'Section item deleted');
};

const reorder = async (req, res) => {
  const data = await service.reorderInSection(req.params.sectionId, req.body);
  success(res, data, 200, 'Order updated');
};

module.exports = { list, getById, create, update, remove, reorder };
