const { Router } = require('express');
const controller = require('../controllers/media.controller');
const upload = require('../middlewares/upload');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { idParam } = require('../validators/common');
const { media } = require('../validators');

const router = Router();

// All media management is admin-only; the files themselves are public at /uploads/...
router.use(requireAuth);

router.post('/', upload, validate(media.upload), controller.upload);
router.get('/', validate(media.query, 'query'), controller.list);
router.get('/:id', validate(idParam, 'params'), controller.getById);
router.patch('/:id', validate(idParam, 'params'), validate(media.update), controller.update);
router.delete('/:id', validate(idParam, 'params'), controller.remove);

module.exports = router;
