const BaseRepository = require('./base.repository');

class TestimonialRepository extends BaseRepository {
  constructor() {
    super('testimonial');
  }
}

module.exports = new TestimonialRepository();
