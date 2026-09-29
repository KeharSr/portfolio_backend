const { authService } = require('../services');
const { success } = require('../utils/response');

const register = async (req, res) => {
  success(res, await authService.register(req.body), 201, 'Registered');
};

const login = async (req, res) => {
  success(res, await authService.login(req.body), 200, 'Logged in');
};

const me = async (req, res) => {
  success(res, await authService.me(req.user.id));
};

const changePassword = async (req, res) => {
  await authService.changePassword(req.user.id, req.body);
  success(res, null, 200, 'Password updated');
};

module.exports = { register, login, me, changePassword };
