module.exports = {
  ...require('./crud.services'),
  authService: require('./auth.service'),
  profileService: require('./profile.service'),
  siteSettingService: require('./siteSetting.service'),
  projectService: require('./project.service'),
  sectionService: require('./section.service'),
  sectionItemService: require('./sectionItem.service'),
  contactMessageService: require('./contactMessage.service'),
  portfolioService: require('./portfolio.service'),
};
