const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { jwtSecret, jwtExpiresIn, allowRegistration } = require('../config/env');
const { userRepository } = require('../repositories');

const sanitize = ({ password, ...user }) => user;

class AuthService {
  signToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: jwtExpiresIn });
  }

  // The first admin can always register; afterwards only if ALLOW_REGISTRATION=true.
  async register({ email, password, name }) {
    const count = await userRepository.count();
    if (count > 0 && !allowRegistration) {
      throw ApiError.forbidden('Registration is closed');
    }
    if (await userRepository.findByEmail(email)) {
      throw ApiError.conflict('Email already registered');
    }
    const user = await userRepository.create({
      email,
      name,
      password: await bcrypt.hash(password, 10),
    });
    return { user: sanitize(user), token: this.signToken(user) };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw ApiError.unauthorized('Invalid email or password');
    }
    return { user: sanitize(user), token: this.signToken(user) };
  }

  async me(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.unauthorized('User no longer exists');
    return sanitize(user);
  }

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await userRepository.findById(userId);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      throw ApiError.unauthorized('Current password is incorrect');
    }
    await userRepository.update(userId, { password: await bcrypt.hash(newPassword, 10) });
  }
}

module.exports = new AuthService();
