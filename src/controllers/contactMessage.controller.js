const BaseController = require('./base.controller');
const { contactMessageService } = require('../services');
const { success } = require('../utils/response');

class ContactMessageController extends BaseController {
  create = async (req, res) => {
    await this.service.create(req.body);
    success(res, null, 201, 'Thanks! Your message has been sent.');
  };

  markRead = async (req, res) => {
    const data = await this.service.markRead(req.params.id, req.body.isRead ?? true);
    success(res, data);
  };
}

module.exports = new ContactMessageController(contactMessageService);
