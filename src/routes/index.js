const { Router } = require('express');
const crudRouter = require('./crudRouter');
const { optionalAuth } = require('../middlewares/auth');
const v = require('../validators');
const c = require('../controllers/crud.controllers');
const projectController = require('../controllers/project.controller');
const portfolioController = require('../controllers/portfolio.controller');

const router = Router();

router.get('/health', (req, res) => res.json({ success: true, status: 'ok' }));

router.use('/auth', require('./auth.routes'));
router.get('/portfolio', portfolioController.getPortfolio);
router.use('/profile', require('./profile.routes'));
router.use('/settings', require('./siteSetting.routes'));

router.use('/social-links', crudRouter(c.socialLinkController, v.socialLink));
router.use('/skills', crudRouter(c.skillController, v.skill));
router.use('/experiences', crudRouter(c.experienceController, v.experience));
router.use('/educations', crudRouter(c.educationController, v.education));
router.use('/certifications', crudRouter(c.certificationController, v.certification));
router.use('/services', crudRouter(c.serviceController, v.service));
router.use('/testimonials', crudRouter(c.testimonialController, v.testimonial));
router.use(
  '/projects',
  crudRouter(projectController, v.project, {
    extend: (r) => r.get('/slug/:slug', optionalAuth, projectController.getBySlug),
  }),
);
router.use('/sections', require('./section.routes'));
router.use('/messages', require('./contactMessage.routes'));
router.use('/media', require('./media.routes'));

module.exports = router;
