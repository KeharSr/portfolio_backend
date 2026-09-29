const { z } = require('zod');
const { Prisma } = require('@prisma/client');

// NOTE: no .default() here on purpose — Prisma applies defaults on create,
// and defaults would otherwise overwrite fields on partial updates.

const str = (max = 255) => z.string().trim().min(1).max(max);
const optStr = (max = 255) => z.string().trim().max(max).nullable().optional();
const optText = () => z.string().trim().max(20000).nullable().optional();
const optUrl = () => z.string().trim().max(2048).nullable().optional();
const optDate = () => z.coerce.date().nullable().optional();
const strArray = () => z.array(z.string().trim().min(1).max(255)).max(100).optional();
const order = () => z.number().int().min(0).optional();
const isVisible = () => z.boolean().optional();
// Prisma needs Prisma.DbNull (not null) to clear a nullable Json column.
const json = () => z.any().optional().transform((v) => (v === null ? Prisma.DbNull : v));

const idParam = z.object({ id: z.uuid() });

const reorderSchema = z
  .array(z.object({ id: z.uuid(), order: z.number().int().min(0) }))
  .min(1)
  .max(500);

// Update schemas must not be empty.
const nonEmpty = (schema) =>
  schema.refine((data) => Object.keys(data).length > 0, { message: 'Request body cannot be empty' });

const crudSchemas = (shape) => {
  const base = z.object(shape).strict();
  return { create: base, update: nonEmpty(base.partial()) };
};

module.exports = {
  z,
  str,
  optStr,
  optText,
  optUrl,
  optDate,
  strArray,
  order,
  isVisible,
  json,
  idParam,
  reorderSchema,
  nonEmpty,
  crudSchemas,
};
