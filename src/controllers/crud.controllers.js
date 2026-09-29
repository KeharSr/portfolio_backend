const BaseController = require('./base.controller');
const services = require('../services');

module.exports = {
  socialLinkController: new BaseController(services.socialLinkService),
  skillController: new BaseController(services.skillService),
  experienceController: new BaseController(services.experienceService),
  educationController: new BaseController(services.educationService),
  certificationController: new BaseController(services.certificationService),
  serviceController: new BaseController(services.serviceService),
  testimonialController: new BaseController(services.testimonialService),
};
