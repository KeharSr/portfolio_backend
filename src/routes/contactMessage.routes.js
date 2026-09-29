const { Router } = require('express');
const controller = require('../controllers/contactMessage.controller');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { idParam } = require('../validators/common');
const { contactMessage } = require('../validators');

const router = Router();

router.post('/', validate(contactMessage.create), controller.create); // public contact form
router.get('/', requireAuth, controller.list); // ?isRead=false
router.get('/:id', requireAuth, validate(idParam, 'params'), controller.getById);
router.patch('/:id/read', requireAuth, validate(idParam, 'params'), validate(contactMessage.markRead), controller.markRead);
router.delete('/:id', requireAuth, validate(idParam, 'params'), controller.remove);

module.exports = router;
