const {
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
  nonEmpty,
  crudSchemas,
} = require('./common');

const auth = {
  register: z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8).max(128),
    name: optStr(),
  }),
  login: z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(1),
  }),
  changePassword: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(128),
  }),
};

const profile = nonEmpty(
  z
    .object({
      fullName: str(),
      headline: optStr(),
      tagline: optStr(500),
      bio: optText(),
      about: optText(),
      avatarUrl: optUrl(),
      coverUrl: optUrl(),
      resumeUrl: optUrl(),
      email: z.email().nullable().optional(),
      phone: optStr(50),
      location: optStr(),
      website: optUrl(),
      yearsOfExp: z.number().int().min(0).max(100).nullable().optional(),
      isAvailable: z.boolean().optional(),
    })
    .strict()
    .partial(),
);

const settings = {
  upsert: z.object({ value: z.any().refine((v) => v !== undefined, 'value is required'), description: optStr(500) }).strict(),
  bulk: z.record(z.string().min(1).max(100), z.any()).refine((o) => Object.keys(o).length > 0, 'Body cannot be empty'),
};

const socialLink = crudSchemas({ platform: str(100), url: str(2048), icon: optStr(), order: order(), isVisible: isVisible() });

const skill = crudSchemas({
  name: str(),
  category: optStr(),
  level: z.number().int().min(0).max(100).nullable().optional(),
  icon: optStr(),
  order: order(),
  isVisible: isVisible(),
});

const experience = crudSchemas({
  company: str(),
  role: str(),
  location: optStr(),
  employment: optStr(100),
  startDate: z.coerce.date(),
  endDate: optDate(),
  isCurrent: z.boolean().optional(),
  description: optText(),
  highlights: strArray(),
  technologies: strArray(),
  companyUrl: optUrl(),
  logoUrl: optUrl(),
  order: order(),
  isVisible: isVisible(),
});

const education = crudSchemas({
  institution: str(),
  degree: str(),
  fieldOfStudy: optStr(),
  location: optStr(),
  grade: optStr(100),
  startDate: z.coerce.date(),
  endDate: optDate(),
  isCurrent: z.boolean().optional(),
  description: optText(),
  logoUrl: optUrl(),
  order: order(),
  isVisible: isVisible(),
});

const project = crudSchemas({
  title: str(),
  slug: optStr(),
  summary: optStr(1000),
  description: optText(),
  imageUrl: optUrl(),
  gallery: z.array(z.string().trim().max(2048)).max(50).optional(),
  technologies: strArray(),
  liveUrl: optUrl(),
  repoUrl: optUrl(),
  category: optStr(),
  isFeatured: z.boolean().optional(),
  startDate: optDate(),
  endDate: optDate(),
  order: order(),
  isVisible: isVisible(),
});

const certification = crudSchemas({
  name: str(),
  issuer: str(),
  issueDate: optDate(),
  expiryDate: optDate(),
  credentialId: optStr(),
  credentialUrl: optUrl(),
  imageUrl: optUrl(),
  order: order(),
  isVisible: isVisible(),
});

const service = crudSchemas({ title: str(), description: optText(), icon: optStr(), order: order(), isVisible: isVisible() });

const testimonial = crudSchemas({
  name: str(),
  role: optStr(),
  company: optStr(),
  message: z.string().trim().min(1).max(5000),
  avatarUrl: optUrl(),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  order: order(),
  isVisible: isVisible(),
});

const section = crudSchemas({
  title: str(),
  slug: optStr(),
  subtitle: optStr(500),
  content: optText(),
  type: optStr(50).transform((v) => v ?? undefined),
  data: json(),
  order: order(),
  isVisible: isVisible(),
});

const sectionItem = crudSchemas({
  title: str(),
  subtitle: optStr(500),
  description: optText(),
  imageUrl: optUrl(),
  link: optUrl(),
  icon: optStr(),
  date: optDate(),
  tags: strArray(),
  data: json(),
  order: order(),
  isVisible: isVisible(),
});

const contactMessage = {
  create: z
    .object({
      name: str(100),
      email: z.email().trim(),
      subject: optStr(200),
      message: z.string().trim().min(1).max(5000),
    })
    .strict(),
  markRead: z.object({ isRead: z.boolean().optional() }).strict(),
};

module.exports = {
  auth,
  profile,
  settings,
  socialLink,
  skill,
  experience,
  education,
  project,
  certification,
  service,
  testimonial,
  section,
  sectionItem,
  contactMessage,
};
