const ApiError = require('../utils/ApiError');
const { profileRepository } = require('../repositories');

class ProfileService {
  async get() {
    const profile = await profileRepository.findFirst();
    if (!profile) throw ApiError.notFound('Profile has not been created yet');
    return profile;
  }

  // Creates the profile on first call, updates it afterwards.
  async upsert(data) {
    const existing = await profileRepository.findFirst();
    if (existing) return profileRepository.update(existing.id, data);
    if (!data.fullName) throw ApiError.badRequest('fullName is required to create the profile');
    return profileRepository.create(data);
  }
}

module.exports = new ProfileService();
