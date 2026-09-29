// Detects the real file type from its bytes instead of trusting the
// client-supplied mimetype or extension.

const startsWith = (buf, bytes, offset = 0) =>
  buf.length >= offset + bytes.length && bytes.every((b, i) => buf[offset + i] === b);

const ascii = (buf, start, end) => buf.subarray(start, end).toString('latin1');

const detectSvg = (buf) => {
  const head = buf.subarray(0, 4096).toString('utf8').replace(/^﻿/, '').trimStart();
  if (!/^(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*(<!DOCTYPE[^>]*>\s*)?<svg[\s>]/i.test(head)) return false;
  return true;
};

// SVGs can carry JavaScript. Reject anything scriptable outright.
const svgIsUnsafe = (buf) => {
  const text = buf.toString('utf8');
  return /<script|<foreignObject|\son[a-z]+\s*=|javascript:|<iframe|<embed|<object/i.test(text);
};

const TYPES = {
  png: { mime: 'image/png', kind: 'image' },
  jpg: { mime: 'image/jpeg', kind: 'image' },
  gif: { mime: 'image/gif', kind: 'image' },
  webp: { mime: 'image/webp', kind: 'image' },
  avif: { mime: 'image/avif', kind: 'image' },
  ico: { mime: 'image/x-icon', kind: 'image' },
  svg: { mime: 'image/svg+xml', kind: 'image' },
  pdf: { mime: 'application/pdf', kind: 'document' },
};

const detectFileType = (buf) => {
  let ext = null;
  if (startsWith(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) ext = 'png';
  else if (startsWith(buf, [0xff, 0xd8, 0xff])) ext = 'jpg';
  else if (ascii(buf, 0, 6) === 'GIF87a' || ascii(buf, 0, 6) === 'GIF89a') ext = 'gif';
  else if (ascii(buf, 0, 4) === 'RIFF' && ascii(buf, 8, 12) === 'WEBP') ext = 'webp';
  else if (ascii(buf, 4, 8) === 'ftyp' && ['avif', 'avis'].includes(ascii(buf, 8, 12))) ext = 'avif';
  else if (startsWith(buf, [0x00, 0x00, 0x01, 0x00])) ext = 'ico';
  else if (ascii(buf, 0, 5) === '%PDF-') ext = 'pdf';
  else if (detectSvg(buf)) ext = 'svg';

  return ext ? { ext, ...TYPES[ext] } : null;
};

const ALLOWED_MIME_TYPES = Object.values(TYPES).map((t) => t.mime);

module.exports = { detectFileType, svgIsUnsafe, ALLOWED_MIME_TYPES };
