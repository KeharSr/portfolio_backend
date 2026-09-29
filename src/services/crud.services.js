const BaseService = require('./base.service');
const normaliseDateRange = require('./dateRange');
const {
  socialLinkRepository,
  skillRepository,
  experienceRepository,
  educationRepository,
  certificationRepository,
  serviceRepository,
  testimonialRepository,
} = require('../repositories');

class ExperienceService extends BaseService {
  async prepareData(data, existing) {
    return normaliseDateRange(data, existing);
  }
}

class EducationService extends BaseService {
  async prepareData(data, existing) {
    return normaliseDateRange(data, existing);
  }
}

module.exports = {
  socialLinkService: new BaseService(socialLinkRepository, { name: 'Social link' }),
  skillService: new BaseService(skillRepository, { name: 'Skill', filterableFields: ['category'] }),
  experienceService: new ExperienceService(experienceRepository, { name: 'Experience' }),
  educationService: new EducationService(educationRepository, { name: 'Education' }),
  certificationService: new BaseService(certificationRepository, { name: 'Certification' }),
  serviceService: new BaseService(serviceRepository, { name: 'Service' }),
  testimonialService: new BaseService(testimonialRepository, { name: 'Testimonial' }),
};
