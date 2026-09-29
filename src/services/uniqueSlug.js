const slugify = require('../utils/slugify');

// Generates a slug from `source` that is not used by any other record.
const uniqueSlug = async (repository, source, excludeId) => {
  const base = slugify(source) || 'item';
  let slug = base;
  let i = 1;
  // eslint-disable-next-line no-await-in-loop
  while (true) {
    const found = await repository.findBySlug(slug);
    if (!found || found.id === excludeId) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
};

module.exports = uniqueSlug;
