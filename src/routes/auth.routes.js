const { Router } = require('express');
const controller = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { auth } = require('../validators');

const router = Router();

router.post('/register', validate(auth.register), controller.register);
router.post('/login', validate(auth.login), controller.login);
router.get('/me', requireAuth, controller.me);
router.patch('/password', requireAuth, validate(auth.changePassword), controller.changePassword);

module.exports = router;
