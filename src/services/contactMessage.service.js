const BaseService = require('./base.service');
const { contactMessageRepository } = require('../repositories');

class ContactMessageService extends BaseService {
  constructor() {
    super(contactMessageRepository, {
      name: 'Message',
      filterableFields: ['isRead'],
      hasVisibility: false,
    });
  }

  markRead(id, isRead = true) {
    return this.update(id, { isRead });
  }
}

module.exports = new ContactMessageService();
