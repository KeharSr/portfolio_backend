const { mediaService } = require('../services');
const { publicUrl } = require('../config/env');
const { success } = require('../utils/response');

const baseUrl = (req) => publicUrl || `${req.protocol}://${req.get('host')}`;

const upload = async (req, res) => {
  const media = await mediaService.upload(req.uploadedFiles, req.body);
  const data = media.map((m) => mediaService.toDto(m, baseUrl(req)));
  // A single "file" upload returns one object; "files" returns an array.
  const single = req.files?.file && !req.files?.files;
  success(res, single ? data[0] : data, 201, 'Uploaded');
};

const list = async (req, res) => {
  const media = await mediaService.list(req.validated?.query);
  success(res, media.map((m) => mediaService.toDto(m, baseUrl(req))));
};

const getById = async (req, res) => {
  success(res, mediaService.toDto(await mediaService.getById(req.params.id), baseUrl(req)));
};

const update = async (req, res) => {
  const media = await mediaService.update(req.params.id, req.body);
  success(res, mediaService.toDto(media, baseUrl(req)), 200, 'File updated');
};

const remove = async (req, res) => {
  await mediaService.remove(req.params.id);
  success(res, null, 200, 'File deleted');
};

module.exports = { upload, list, getById, update, remove };
