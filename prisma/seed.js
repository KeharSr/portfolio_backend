require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'admin12345';

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: 'Admin', password: await bcrypt.hash(password, 10) },
  });

  if (!(await prisma.profile.findFirst())) {
    await prisma.profile.create({
      data: {
        fullName: 'Your Name',
        headline: 'Full Stack Developer',
        tagline: 'I build things for the web.',
        bio: 'Short bio shown in the hero section.',
        about: 'Longer text for the About section.',
        email,
        location: 'Earth',
      },
    });
  }

  const settings = {
    siteTitle: 'My Portfolio',
    heroCta: { label: 'Hire me', href: '#contact' },
    footerText: '© Your Name. All rights reserved.',
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value } });
  }

  if ((await prisma.skill.count()) === 0) {
    await prisma.skill.createMany({
      data: [
        { name: 'JavaScript', category: 'Languages', level: 90, order: 0 },
        { name: 'Node.js', category: 'Backend', level: 85, order: 1 },
        { name: 'PostgreSQL', category: 'Database', level: 80, order: 2 },
      ],
    });
  }

  console.log(`Seed complete. Admin login: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
