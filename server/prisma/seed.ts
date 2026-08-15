import { PrismaClient, ProjectStatus, AppPlatform, BlogStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding structural development records...');

  // 1. Profile & Social Links
  await prisma.socialLink.deleteMany();
  await prisma.profile.deleteMany();

  const profile = await prisma.profile.create({
    data: {
      fullName: 'Alex Morgan',
      tagline: 'Full-Stack Developer & CS Student',
      shortBio:
        'Passionate computer science student building scalable web applications and developer tooling.',
      fullAbout:
        'I am an aspiring software engineer with hands-on experience in modern web technologies, distributed systems, and cloud infrastructure. Currently exploring high-performance backend systems and interactive UI design.',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      resumePdfUrl: '/assets/resume.pdf',
      location: 'San Francisco, CA',
      statusBadge: 'Open for Summer 2026 Internships',
      isAvailable: true,
      socialLinks: {
        create: [
          {
            platform: 'GitHub',
            url: 'https://github.com/example',
            iconName: 'github',
            displayOrder: 1,
          },
          {
            platform: 'LinkedIn',
            url: 'https://linkedin.com/in/example',
            iconName: 'linkedin',
            displayOrder: 2,
          },
          {
            platform: 'Twitter',
            url: 'https://twitter.com/example',
            iconName: 'twitter',
            displayOrder: 3,
          },
        ],
      },
    },
  });
  console.log(`✅ Profile created: ${profile.fullName}`);

  // 2. Skill Categories & Skills
  await prisma.projectSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();

  const langCategory = await prisma.skillCategory.create({
    data: {
      name: 'Programming Languages',
      displayOrder: 1,
      skills: {
        create: [
          { name: 'TypeScript', proficiencyLevel: 'Advanced', isFeatured: true, displayOrder: 1 },
          {
            name: 'JavaScript (ES6+)',
            proficiencyLevel: 'Advanced',
            isFeatured: true,
            displayOrder: 2,
          },
          { name: 'Python', proficiencyLevel: 'Proficient', isFeatured: true, displayOrder: 3 },
          { name: 'SQL', proficiencyLevel: 'Proficient', isFeatured: false, displayOrder: 4 },
        ],
      },
    },
    include: { skills: true },
  });

  const frameworkCategory = await prisma.skillCategory.create({
    data: {
      name: 'Frameworks & Libraries',
      displayOrder: 2,
      skills: {
        create: [
          { name: 'React', proficiencyLevel: 'Advanced', isFeatured: true, displayOrder: 1 },
          {
            name: 'Node.js / Express',
            proficiencyLevel: 'Advanced',
            isFeatured: true,
            displayOrder: 2,
          },
          { name: 'Tailwind CSS', proficiencyLevel: 'Advanced', isFeatured: true, displayOrder: 3 },
          { name: 'Next.js', proficiencyLevel: 'Proficient', isFeatured: false, displayOrder: 4 },
        ],
      },
    },
    include: { skills: true },
  });

  const dbCategory = await prisma.skillCategory.create({
    data: {
      name: 'Databases & Tools',
      displayOrder: 3,
      skills: {
        create: [
          { name: 'PostgreSQL', proficiencyLevel: 'Proficient', isFeatured: true, displayOrder: 1 },
          { name: 'Prisma ORM', proficiencyLevel: 'Proficient', isFeatured: true, displayOrder: 2 },
          { name: 'Git & GitHub', proficiencyLevel: 'Advanced', isFeatured: true, displayOrder: 3 },
          { name: 'Docker', proficiencyLevel: 'Familiar', isFeatured: false, displayOrder: 4 },
        ],
      },
    },
    include: { skills: true },
  });
  console.log('✅ Skills & Categories seeded');

  // 3. Projects & Screenshots
  await prisma.projectScreenshot.deleteMany();
  await prisma.project.deleteMany();

  const tsSkill = langCategory.skills.find((s) => s.name === 'TypeScript')!;
  const reactSkill = frameworkCategory.skills.find((s) => s.name === 'React')!;
  const nodeSkill = frameworkCategory.skills.find((s) => s.name === 'Node.js / Express')!;
  const pgSkill = dbCategory.skills.find((s) => s.name === 'PostgreSQL')!;

  await prisma.project.create({
    data: {
      title: 'Full-Stack Developer Hub',
      slug: 'full-stack-developer-hub',
      shortSummary:
        'A modular portfolio and content management system with end-to-end type safety.',
      fullDescription:
        'Engineered a complete developer portfolio platform featuring an authenticated admin control center, automatic asset optimization, and a responsive public portal.',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
      githubUrl: 'https://github.com/example/student-portfolio',
      liveDemoUrl: 'https://portfolio-demo.example.com',
      status: ProjectStatus.COMPLETED,
      isFeatured: true,
      displayOrder: 1,
      skills: {
        create: [
          { skillId: tsSkill.id },
          { skillId: reactSkill.id },
          { skillId: nodeSkill.id },
          { skillId: pgSkill.id },
        ],
      },
      screenshots: {
        create: [
          {
            imageUrl:
              'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
            caption: 'Main Dashboard View',
            displayOrder: 1,
          },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      title: 'DevPulse Code Analytics',
      slug: 'devpulse-code-analytics',
      shortSummary: 'A real-time developer productivity and commit telemetry dashboard.',
      fullDescription:
        'A background analytics service that ingests Git webhooks and generates metrics charts on commit frequencies, code review velocity, and test coverage.',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      githubUrl: 'https://github.com/example/devpulse',
      status: ProjectStatus.IN_PROGRESS,
      isFeatured: true,
      displayOrder: 2,
      skills: {
        create: [{ skillId: tsSkill.id }, { skillId: nodeSkill.id }],
      },
    },
  });
  console.log('✅ Projects & Screenshots seeded');

  // 4. Apps & Releases
  await prisma.appScreenshot.deleteMany();
  await prisma.appRelease.deleteMany();
  await prisma.app.deleteMany();

  await prisma.app.create({
    data: {
      name: 'SnippetForge CLI',
      slug: 'snippetforge-cli',
      tagline: 'High-speed code snippet manager for terminal power users',
      description:
        'A cross-platform command line utility for syncing, searching, and managing code templates directly from the shell with zero latency.',
      iconUrl:
        'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=200&q=80',
      githubUrl: 'https://github.com/example/snippetforge',
      currentVersion: '1.2.0',
      isFeatured: true,
      displayOrder: 1,
      releases: {
        create: [
          {
            version: '1.2.0',
            platform: AppPlatform.CROSS_PLATFORM,
            downloadUrl:
              'https://github.com/example/snippetforge/releases/download/v1.2.0/snippetforge-v1.2.0.zip',
            releaseNotes: 'Added fuzzy search indexing and multi-tag filtering.',
          },
        ],
      },
    },
  });
  console.log('✅ Applications seeded');

  // 5. Education & Certificates
  await prisma.education.deleteMany();
  await prisma.education.create({
    data: {
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: 'Aug 2022',
      endDate: 'May 2026',
      gradeOrCgpa: '3.9 / 4.0',
      activities: 'ACM Student Chapter, Open Source Club Lead',
      coursework: [
        'Data Structures & Algorithms',
        'Operating Systems',
        'Database Architecture',
        'Computer Networks',
      ],
      displayOrder: 1,
    },
  });

  await prisma.certificate.deleteMany();
  await prisma.certificate.create({
    data: {
      title: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services (AWS)',
      issueDate: 'Jan 2024',
      expirationDate: 'Jan 2027',
      credentialId: 'AWS-CCP-987654321',
      credentialUrl: 'https://aws.amazon.com/verification',
      category: 'Cloud Certification',
      displayOrder: 1,
    },
  });
  console.log('✅ Education & Certificates seeded');

  // 6. Blog Posts & Tags (1 Published, 1 Draft to verify draft protection)
  await prisma.postTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.blogPost.deleteMany();

  const archTag = await prisma.tag.create({ data: { name: 'Architecture', slug: 'architecture' } });
  const tsTag = await prisma.tag.create({ data: { name: 'TypeScript', slug: 'typescript' } });

  await prisma.blogPost.create({
    data: {
      title: 'Building a Full-Stack Monorepo with TypeScript & Prisma',
      slug: 'building-fullstack-monorepo-typescript-prisma',
      summary:
        'A deep dive into organizing client, server, and shared contracts for maximum type safety and developer velocity.',
      contentMarkdown: `# Building a Full-Stack Monorepo with TypeScript & Prisma\n\nMonorepos provide exceptional developer ergonomics when sharing types between frontend and backend...\n\n\`\`\`typescript\nimport { ApiResponse } from '@portfolio/shared';\n\`\`\``,
      coverImageUrl:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      readingTimeMinutes: 5,
      status: BlogStatus.PUBLISHED,
      publishedAt: new Date('2026-02-01T10:00:00Z'),
      tags: {
        create: [{ tagId: archTag.id }, { tagId: tsTag.id }],
      },
    },
  });

  await prisma.blogPost.create({
    data: {
      title: 'Internal Architecture Draft (Should Never Be Public)',
      slug: 'internal-architecture-draft',
      summary: 'Draft notes on upcoming version 2 optimizations.',
      contentMarkdown: `# Confidential Draft\nThis draft post must never appear on public endpoints.`,
      readingTimeMinutes: 2,
      status: BlogStatus.DRAFT,
      publishedAt: null,
    },
  });
  console.log('✅ Blog Posts seeded (1 Published, 1 Draft)');

  // 7. Public Site Settings
  await prisma.siteSetting.upsert({
    where: { key: 'site_public_config' },
    update: {},
    create: {
      key: 'site_public_config',
      description: 'Public metadata, features, and branding configuration',
      value: {
        siteTitle: 'Alex Morgan — Full-Stack Developer & Student',
        siteDescription: 'Personal portfolio and application showcase of Alex Morgan.',
        authorName: 'Alex Morgan',
        seoKeywords: [
          'Alex Morgan',
          'Full-Stack Developer',
          'Computer Science',
          'React',
          'Node.js',
          'TypeScript',
        ],
        features: {
          blogEnabled: true,
          appsEnabled: true,
          certificatesEnabled: true,
          contactFormEnabled: true,
        },
      },
    },
  });
  // 8. Initial Admin User Account
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'AdminSecret123!';
  const argon2Module = await import('argon2');
  const passwordHash = await argon2Module.default.hash(adminPassword, {
    type: argon2Module.default.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin Account created: ${adminUser.email} (Password: ${adminPassword})`);

  console.log('✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
