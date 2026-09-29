const { Router } = require('express');
const crudRouter = require('./crudRouter');
const sectionController = require('../controllers/section.controller');
const itemController = require('../controllers/sectionItem.controller');
const validate = require('../middlewares/validate');
const { requireAuth, optionalAuth } = require('../middlewares/auth');
const { z, reorderSchema } = require('../validators/common');
const { section, sectionItem } = require('../validators');

const sectionParam = z.object({ sectionId: z.uuid() });
const itemParams = z.object({ sectionId: z.uuid(), id: z.uuid() });

const router = crudRouter(sectionController, section, {
  extend: (r) => {
    r.get('/slug/:slug', optionalAuth, sectionController.getBySlug);

    // Nested items: /sections/:sectionId/items
    const items = Router({ mergeParams: true });
    items.get('/', optionalAuth, validate(sectionParam, 'params'), itemController.list);
    items.post('/', requireAuth, validate(sectionParam, 'params'), validate(sectionItem.create), itemController.create);
    items.patch('/reorder', requireAuth, validate(sectionParam, 'params'), validate(reorderSchema), itemController.reorder);
    items.get('/:id', optionalAuth, validate(itemParams, 'params'), itemController.getById);
    items.patch('/:id', requireAuth, validate(itemParams, 'params'), validate(sectionItem.update), itemController.update);
    items.put('/:id', requireAuth, validate(itemParams, 'params'), validate(sectionItem.update), itemController.update);
    items.delete('/:id', requireAuth, validate(itemParams, 'params'), itemController.remove);
    r.use('/:sectionId/items', items);
  },
});

module.exports = router;
