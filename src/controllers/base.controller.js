const { success } = require('../utils/response');

/**
 * Generic HTTP layer for a CRUD service: reads the request,
 * calls the service, shapes the response. No business logic here.
 */
class BaseController {
  constructor(service) {
    this.service = service;
  }

  // Authenticated admins also see hidden records.
  static includeHidden(req) {
    return Boolean(req.user);
  }

  list = async (req, res) => {
    const data = await this.service.list({
      query: req.query,
      includeHidden: BaseController.includeHidden(req),
    });
    success(res, data);
  };

  getById = async (req, res) => {
    const data = await this.service.getById(req.params.id, {
      includeHidden: BaseController.includeHidden(req),
    });
    success(res, data);
  };

  create = async (req, res) => {
    const data = await this.service.create(req.body);
    success(res, data, 201, `${this.service.name} created`);
  };

  update = async (req, res) => {
    const data = await this.service.update(req.params.id, req.body);
    success(res, data, 200, `${this.service.name} updated`);
  };

  remove = async (req, res) => {
    await this.service.remove(req.params.id);
    success(res, null, 200, `${this.service.name} deleted`);
  };

  reorder = async (req, res) => {
    const data = await this.service.reorder(req.body);
    success(res, data, 200, 'Order updated');
  };
}

module.exports = BaseController;
