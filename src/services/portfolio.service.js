const { profileRepository } = require('../repositories');
const crud = require('./crud.services');
const projectService = require('./project.service');
const sectionService = require('./section.service');
const siteSettingService = require('./siteSetting.service');

// Aggregates every visible section so the frontend can render the site in one request.
class PortfolioService {
  async getPublicPortfolio() {
    const [
      profile,
      settings,
      socialLinks,
      skills,
      experiences,
      educations,
      projects,
      certifications,
      services,
      testimonials,
      sections,
    ] = await Promise.all([
      profileRepository.findFirst(),
      siteSettingService.asMap(),
      crud.socialLinkService.list(),
      crud.skillService.list(),
      crud.experienceService.list(),
      crud.educationService.list(),
      projectService.list(),
      crud.certificationService.list(),
      crud.serviceService.list(),
      crud.testimonialService.list(),
      sectionService.list(),
    ]);

    return {
      profile,
      settings,
      socialLinks,
      skills,
      experiences,
      educations,
      projects,
      certifications,
      services,
      testimonials,
      sections,
    };
  }
}

module.exports = new PortfolioService();
