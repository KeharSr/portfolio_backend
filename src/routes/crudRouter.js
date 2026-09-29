const { Router } = require('express');
const validate = require('../middlewares/validate');
const { requireAuth, optionalAuth } = require('../middlewares/auth');
const { idParam, reorderSchema } = require('../validators/common');

/**
 * Standard CRUD routes:
 *   GET    /          public (admins also see hidden)
 *   GET    /:id       public
 *   POST   /          admin
 *   PATCH  /reorder   admin  body: [{ id, order }]
 *   PATCH  /:id       admin
 *   DELETE /:id       admin
 */
const crudRouter = (controller, schemas, { extend } = {}) => {
  const router = Router();

  if (extend) extend(router);

  router.get('/', optionalAuth, controller.list);
  router.post('/', requireAuth, validate(schemas.create), controller.create);
  router.patch('/reorder', requireAuth, validate(reorderSchema), controller.reorder);
  router.get('/:id', optionalAuth, validate(idParam, 'params'), controller.getById);
  router.patch('/:id', requireAuth, validate(idParam, 'params'), validate(schemas.update), controller.update);
  router.put('/:id', requireAuth, validate(idParam, 'params'), validate(schemas.update), controller.update);
  router.delete('/:id', requireAuth, validate(idParam, 'params'), controller.remove);

  return router;
};

module.exports = crudRouter;
