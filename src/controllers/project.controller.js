const BaseController = require('./base.controller');
const { projectService } = require('../services');
const { success } = require('../utils/response');

class ProjectController extends BaseController {
  getBySlug = async (req, res) => {
    const data = await this.service.getBySlug(req.params.slug, {
      includeHidden: BaseController.includeHidden(req),
    });
    success(res, data);
  };
}

module.exports = new ProjectController(projectService);
