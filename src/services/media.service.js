const crypto = require('crypto');
const { imageSize } = require('image-size');
const ApiError = require('../utils/ApiError');
const { detectFileType, svgIsUnsafe } = require('../utils/fileType');
const storage = require('../storage');
const { mediaRepository } = require('../repositories');

const readDimensions = (buffer, ext) => {
  if (ext === 'pdf') return {};
  try {
    const { width, height } = imageSize(buffer);
    return { width: width ?? null, height: height ?? null };
  } catch {
    return {};
  }
};

class MediaService {
  // Adds `path` and `url` (absolute) so the frontend can use the file directly.
  // Cloud storage already returns an absolute URL, so baseUrl is only prepended to relative paths.
  toDto(media, baseUrl) {
    const path = storage.publicPath(media.key);
    return { ...media, path, url: /^https?:\/\//.test(path) ? path : `${baseUrl}${path}` };
  }

  // Checks every file before saving any, so one bad file rejects the whole upload.
  inspect(file) {
    const type = detectFileType(file.buffer);
    if (!type) {
      throw ApiError.badRequest(`"${file.originalname}" is not a supported image or PDF`);
    }
    if (type.ext === 'svg' && svgIsUnsafe(file.buffer)) {
      throw ApiError.badRequest(`"${file.originalname}" contains scripts or event handlers, which are not allowed in SVGs`);
    }
    return type;
  }

  async upload(files, { folder = 'general', alt } = {}) {
    const inspected = files.map((file) => ({ file, type: this.inspect(file) }));
    const saved = [];

    try {
      for (const { file, type } of inspected) {
        const key = `${folder}/${crypto.randomUUID()}.${type.ext}`;
        await storage.save(key, file.buffer);
        saved.push(key);

        const media = await mediaRepository.create({
          key,
          folder,
          originalName: file.originalname.slice(0, 255),
          mimeType: type.mime,
          size: file.size,
          alt: alt || null,
          ...readDimensions(file.buffer, type.ext),
        });
        saved[saved.length - 1] = media;
      }
    } catch (err) {
      // Roll back anything written by this request.
      await Promise.all(
        saved.map((item) =>
          typeof item === 'string'
            ? storage.remove(item)
            : Promise.all([storage.remove(item.key), mediaRepository.delete(item.id)]),
        ),
      ).catch(() => {});
      throw err;
    }

    return saved;
  }

  list({ folder, type } = {}) {
    const where = {};
    if (folder) where.folder = folder;
    if (type === 'image') where.mimeType = { startsWith: 'image/' };
    if (type === 'document') where.mimeType = { not: { startsWith: 'image/' } };
    return mediaRepository.findMany({ where });
  }

  async getById(id) {
    const media = await mediaRepository.findById(id);
    if (!media) throw ApiError.notFound('File not found');
    return media;
  }

  async update(id, data) {
    await this.getById(id);
    return mediaRepository.update(id, data);
  }

  async remove(id) {
    const media = await this.getById(id);
    await mediaRepository.delete(id);
    await storage.remove(media.key);
  }
}

module.exports = new MediaService();
