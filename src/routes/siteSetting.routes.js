const { Router } = require('express');
const controller = require('../controllers/siteSetting.controller');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { settings } = require('../validators');

const router = Router();

router.get('/', controller.list); // ?format=map for { key: value }
router.put('/', requireAuth, validate(settings.bulk), controller.bulkUpsert);
router.get('/:key', controller.get);
router.put('/:key', requireAuth, validate(settings.upsert), controller.upsert);
router.delete('/:key', requireAuth, controller.remove);

module.exports = router;
