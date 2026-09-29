const { Router } = require('express');
const controller = require('../controllers/profile.controller');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { profile } = require('../validators');

const router = Router();

router.get('/', controller.get);
router.put('/', requireAuth, validate(profile), controller.upsert);
router.patch('/', requireAuth, validate(profile), controller.upsert);

module.exports = router;
